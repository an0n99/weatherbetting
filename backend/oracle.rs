use anchor_lang::prelude::*;

declare_id!("OracleProgramIDHere"); 

#[program]
pub mod oracle_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, oracle_address: Pubkey) -> Result<()> {
        let oracle_account = &mut ctx.accounts.oracle_account;
        oracle_account.oracle_address = oracle_address;
        oracle_account.weather_data = 0; // Initialize with default value
        Ok(())
    }

    pub fn update_weather_data(ctx: Context<UpdateWeatherData>, weather_data: i64) -> Result<()> {
        let oracle_account = &mut ctx.accounts.oracle_account;
        oracle_account.weather_data = weather_data;
        Ok(())
    }

    pub fn get_weather_data(ctx: Context<GetWeatherData>) -> Result<i64> {
        let oracle_account = &ctx.accounts.oracle_account;
        Ok(oracle_account.weather_data)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8)] // Adjust space as needed
    pub oracle_account: Account<'info, OracleAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateWeatherData<'info> {
    #[account(mut)]
    pub oracle_account: Account<'info, OracleAccount>,
}

#[derive(Accounts)]
pub struct GetWeatherData<'info> {
    #[account()]
    pub oracle_account: Account<'info, OracleAccount>,
}

#[account]
pub struct OracleAccount {
    pub oracle_address: Pubkey,
    pub weather_data: i64, 
}
