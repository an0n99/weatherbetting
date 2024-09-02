use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, Wallet } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function WeatherBetPlatform() {
  const [darkMode, setDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [activeBets, setActiveBets] = useState([
    { id: 1, location: 'New York', condition: 'Temperature > 30°C', initialOdds: '1.5', currentOdds: '1.8', creator: '0x1234...5678', stake: '100' },
    { id: 2, location: 'London', condition: 'Precipitation > 5mm', initialOdds: '2.0', currentOdds: '1.9', creator: '0xabcd...efgh', stake: '50' },
    { id: 3, location: 'Tokyo', condition: 'Wind Speed > 20km/h', initialOdds: '3.0', currentOdds: '2.5', creator: '0x9876...5432', stake: '75' },
  ])
  const [myBets, setMyBets] = useState([])
  const [winningBets, setWinningBets] = useState([
    { id: 4, location: 'Paris', condition: 'Temperature < 10°C', odds: '2.5', stake: '80', winnings: '200' },
    { id: 5, location: 'Sydney', condition: 'No Rain', odds: '1.8', stake: '120', winnings: '216' },
  ])
  const [selectedBet, setSelectedBet] = useState(null)
  const [joinAmount, setJoinAmount] = useState('')
  const [newBet, setNewBet] = useState({
    location: '',
    condition: '',
    stake: '',
  })

  useEffect(() => {
    if (walletConnected) {
      setMyBets(activeBets.filter(bet => bet.creator === walletAddress))
    }
  }, [walletConnected, activeBets, walletAddress])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const connectWallet = () => {
    const mockAddress = '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4)
    setWalletAddress(mockAddress)
    setWalletConnected(true)
    toast.success(`Wallet connected: ${mockAddress}`)
  }

  const filteredBets = activeBets.filter(bet => 
    bet.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bet.condition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleJoinBet = () => {
    if (selectedBet && joinAmount) {
      if (!walletConnected) {
        toast.info('Please connect your wallet to join a bet')
        return
      }
      const updatedBets = activeBets.map(bet => 
        bet.id === selectedBet.id 
          ? {...bet, stake: (parseFloat(bet.stake) + parseFloat(joinAmount)).toString()}
          : bet
      )
      setActiveBets(updatedBets)
      setMyBets([...myBets, {...selectedBet, stake: joinAmount}])
      setSelectedBet(null)
      setJoinAmount('')
      toast.success(`Successfully joined bet for ${selectedBet.location}`)
    }
  }

  const handleCreateBet = () => {
    if (!walletConnected) {
      toast.info('Please connect your wallet to create a bet')
      return
    }
    if (newBet.location && newBet.condition && newBet.stake) {
      const newId = activeBets.length + winningBets.length + 1
      const createdBet = {
        id: newId,
        ...newBet,
        initialOdds: '2.0',
        currentOdds: '2.0',
        creator: walletAddress,
      }
      setActiveBets([...activeBets, createdBet])
      setMyBets([...myBets, createdBet])
      setNewBet({ location: '', condition: '', stake: '' })
      toast.success(`New bet created for ${newBet.location}`)
    } else {
      toast.error('Please fill in all fields')
    }
  }

  const handleClaimWinnings = (betId) => {
    if (!walletConnected) {
      toast.info('Please connect your wallet to claim winnings')
      return
    }
    const claimedBet = winningBets.find(bet => bet.id === betId)
    setWinningBets(winningBets.filter(bet => bet.id !== betId))
    toast.success(`Claimed ${claimedBet.winnings} for bet in ${claimedBet.location}`)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900`}>
      <div className="container mx-auto px-4 py-8">
        <Card className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">WeatherBet</CardTitle>
              <div className="flex items-center space-x-2">
                {walletConnected ? (
                  <span className="text-sm text-gray-600 dark:text-gray-300">{walletAddress}</span>
                ) : (
                  <Button variant="outline" size="sm" onClick={connectWallet}>
                    <Wallet className="h-4 w-4 mr-2" /> Connect Wallet
                  </Button>
                )}
                <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <CardDescription>Decentralized weather betting platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active-bets" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="active-bets">Active Bets</TabsTrigger>
                <TabsTrigger value="create-bet">Create Bet</TabsTrigger>
                <TabsTrigger value="my-bets">My Bets</TabsTrigger>
                <TabsTrigger value="claim-winnings">Claim Winnings</TabsTrigger>
              </TabsList>
              <TabsContent value="active-bets">
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Search by location or condition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Current Odds</TableHead>
                          <TableHead>Stake</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBets.map((bet) => (
                          <TableRow key={bet.id}>
                            <TableCell>{bet.location}</TableCell>
                            <TableCell>{bet.condition}</TableCell>
                            <TableCell>{bet.currentOdds}</TableCell>
                            <TableCell>{bet.stake}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedBet(bet)}>Join Bet</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Join Bet</DialogTitle>
                                    <DialogDescription>
                                      Enter the amount you want to stake on this bet.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="amount" className="text-right">
                                        Amount
                                      </Label>
                                      <Input
                                        id="amount"
                                        type="number"
                                        className="col-span-3"
                                        value={joinAmount}
                                        onChange={(e) => setJoinAmount(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={handleJoinBet}>Confirm</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="create-bet">
                <Card>
                  <CardHeader>
                    <CardTitle>Create a New Bet</CardTitle>
                    <CardDescription>Set up a new weather bet</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newBet.location}
                        onChange={(e) => setNewBet({...newBet, location: e.target.value})}
                        placeholder="Enter city or coordinates"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition">Weather Condition</Label>
                      <Select onValueChange={(value) => setNewBet({...newBet, condition: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Temperature > 30°C">Temperature > 30°C</SelectItem>
                          <SelectItem value="Precipitation > 5mm">Precipitation > 5mm</SelectItem>
                          <SelectItem value="Wind Speed > 20km/h">Wind Speed > 20km/h</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stake">Stake Amount</Label>
                      <Input
                        id="stake"
                        type="number"
                        value={newBet.stake}
                        onChange={(e) => setNewBet({...newBet, stake: e.target.value})}
                        placeholder="Enter stake amount"
                      />
                    </div>
                    <Button onClick={handleCreateBet} className="w-full">Create Bet</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="my-bets">
                <Card>
                  <CardHeader>
                    <CardTitle>My Active Bets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {walletConnected ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Location</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Current Odds</TableHead>
                            <TableHead>Stake</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {myBets.map((bet) => (
                            <TableRow key={bet.id}>
                              <TableCell>{bet.location}</TableCell>
                              <TableCell>{bet.condition}</TableCell>
                              <TableCell>{bet.currentOdds}</TableCell>
                              <TableCell>{bet.stake}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center py-4">Connect your wallet to view your bets</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="claim-winnings">
                <Card>
                  <CardHeader>
                    <CardTitle>Claim Your Winnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {walletConnected ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Location</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Odds</TableHead>
                            <TableHead>Stake</TableHead>
                            <TableHead>Winnings</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {winningBets.map((bet) => (
                            <TableRow key={bet.id}>
                              <TableCell>{bet.location}</TableCell>
                              <TableCell>{bet.condition}</TableCell>
                              <TableCell>{bet.odds}</TableCell>
                              <TableCell>{bet.stake}</TableCell>
                              <TableCell>{bet.winnings}</TableCell>
                              <TableCell>
                                <Button onClick={() => handleClaimWinnings(bet.id)} variant="outline" size="sm">Claim</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center py-4">Connect your wallet to view and claim your winnings</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}
