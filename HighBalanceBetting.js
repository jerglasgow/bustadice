var config = {
  baseBet: { label: "Base bet", type: "balance", value: 100 },             // base bet in satoshis (100 satoshis = 1 bit)
  target: { label: "Target", type: "multiplier", value: 3.5 },               // bet multiplier 
  betMultiplier: { label: "Bet multiplier", type: "multiplier", value: 3.5 } // what to multiply the satoshis by when a bet is lost
}


let lossCount = 0
this.log(`Starting martingale with a base bet of ${config.baseBet.value} satoshis.`)

while (true) {
  // make the bet and wait for the result
  const { multiplier } = await this.bet(betSize(lossCount), config.target.value)

  if (multiplier < config.target.value) { // loss
    lossCount++
    this.log(`Lost bet. Multiplying bet size by ${config.betMultiplier.value} for new bet size of ${betSize(lossCount)} satoshis.`)
  } else { // win
    lossCount = 0
    this.log(`Won bet. Setting bet size to ${config.baseBet.value} satoshis.`)
  }
}

function betSize(lossCount) {
  const bet = config.baseBet.value * Math.pow(config.betMultiplier.value, lossCount)
  return Math.round(bet / 100) * 100
}
