use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("BetProgramIDHere"); // Replace with your deployed program ID

#[program]
pub mod bet_program {
    use super::*;

    pub fn create_bet(
        ctx: Context<CreateBet>,
        location: String,
        event_timestamp: i64,
        initial_probability: u8,
    ) -> Result<()> {
        let bet_account = &mut ctx.accounts.bet_account;
        bet_account.creator = *ctx.accounts.creator.key;
        bet_account.location = location;
        bet_account.event_timestamp = event_timestamp;
        bet_account.initial_probability = initial_probability;
        bet_account.total_yes_stakes = 0;
        bet_account.total_no_stakes = 0;
        bet_account.settled = false;
        Ok(())
    }

    pub fn place_bet(ctx: Context<PlaceBet>, bet_amount: u64, side: bool) -> Result<()> {
        let bet_account = &mut ctx.accounts.bet_account;
        let user_stakes = &mut ctx.accounts.user_stakes;

        require!(bet_account.event_timestamp > Clock::get()?.unix_timestamp, "Bet has ended");

        if side {
            user_stakes.yes_stakes = user_stakes.yes_stakes.checked_add(bet_amount).ok_or(ErrorCode::Overflow)?;
            bet_account.total_yes_stakes = bet_account.total_yes_stakes.checked_add(bet_amount).ok_or(ErrorCode::Overflow)?;
        } else {
            user_stakes.no_stakes = user_stakes.no_stakes.checked_add(bet_amount).ok_or(ErrorCode::Overflow)?;
            bet_account.total_no_stakes = bet_account.total_no_stakes.checked_add(bet_amount).ok_or(ErrorCode::Overflow)?;
        }

        // Transfer the bet amount from the user's account to the bet program
        token::transfer(ctx.accounts.into_transfer_to_bet(), bet_amount)?;

        Ok(())
    }

    pub fn settle_bet(ctx: Context<SettleBet>, outcome: bool) -> Result<()> {
        let bet_account = &mut ctx.accounts.bet_account;
        require!(Clock::get()?.unix_timestamp >= bet_account.event_timestamp, "Bet has not ended");
        require!(!bet_account.settled, "Bet already settled");

        bet_account.settled = true;

        let total_yes_stakes = bet_account.total_yes_stakes;
        let total_no_stakes = bet_account.total_no_stakes;
        let total_pool = total_yes_stakes.checked_add(total_no_stakes).ok_or(ErrorCode::Overflow)?;
        let payout_multiplier = if outcome {
            total_pool as f64 / total_yes_stakes as f64
        } else {
            total_pool as f64 / total_no_stakes as f64
        };

        let user_stakes = &ctx.accounts.user_stakes;
        let mut payout_amount = 0;

        if outcome {
            if user_stakes.yes_stakes > 0 {
                payout_amount = (user_stakes.yes_stakes as f64 * payout_multiplier) as u64;
            }
        } else {
            if user_stakes.no_stakes > 0 {
                payout_amount = (user_stakes.no_stakes as f64 * payout_multiplier) as u64;
            }
        }

        if payout_amount > 0 {
            // Transfer the payout amount to the user
            token::transfer(ctx.accounts.into_transfer_to_user(), payout_amount)?;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateBet<'info> {
    #[account(init, payer = creator, space = 8 + 128)] // Adjust space as needed
    pub bet_account: Account<'info, BetAccount>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub bet_account: Account<'info, BetAccount>,
    #[account(mut)]
    pub user_stakes: Account<'info, UserStakes>,
    #[account(
        mut,
        constraint = user_token_account.owner == user_stakes.to_account_info().key
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = bet_token_account.owner == bet_account.to_account_info().key
    )]
    pub bet_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SettleBet<'info> {
    #[account(mut)]
    pub bet_account: Account<'info, BetAccount>,
    #[account(
        mut,
        constraint = user_stakes.owner == user.to_account_info().key
    )]
    pub user_stakes: Account<'info, UserStakes>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct BetAccount {
    pub creator: Pubkey,
    pub location: String,
    pub event_timestamp: i64,
    pub initial_probability: u8,
    pub total_yes_stakes: u64,
    pub total_no_stakes: u64,
    pub settled: bool,
}

#[account]
pub struct UserStakes {
    pub yes_stakes: u64,
    pub no_stakes: u64,
}

#[error]
pub enum ErrorCode {
    #[msg("Overflow occurred")]
    Overflow,
}
