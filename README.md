# Food Token

Token contracts of the SSS Food Token contribution.

## Acknowledgements

These token contracts have been influenced by the work of [MelonPort](https://github.com/melonproject/melon/).

## Contract key methods with stages
DeliveryContract(name, code, Token) 
setAttributes(...) onlyStage(Stages.New) -> Stages.HasAttibutes
setParties(...) onlyOwner, onlyStage(Stages.HasAttibutes) -> WaitingForParties
cancel() onlyOwner, onlyStage(Stages.WaitingForParties) -> Canceled
acceptInvitation() onlyStage(Stages.WaitingForParties) -> InProgress (only invited person)
reimburse() onlyOwner, onlyStage(Stages.InProgress) -> Reimburse
approve() onlyOwner, onlyStage(Stages.InProgress) -> Complete
addMeasurement() onlyStage(Stages.InProgress) (devices)

Constant:
* getParties()
* getTotalTokensToLock()
* getAttributes()
* getMeasurements()
* name()
* code()


