class CalcController {
    constructor() {
        this._lastOperator = ''
        this._lastNumber = ''
        this._operation = []
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector(".display")
        this._historyCalcEl = document.querySelector(".history")
        this._dateEl = document.querySelector(".data")
        this._timeEl = document.querySelector(".hora")
        this._currentDate
        this.initialize()
        this.initbuttonsEvents()
        this.setLastNumberToDisplay()
        this.initKeyboard()
    }

    initialize() {
        this.setDisplayDateTime()

        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)
    }

    clearAll() {
        this._operation = []
        this.setLastNumberToDisplay()
        this.historyCalc = this._operation.join("")
    }

    clearEntry() {
        this._operation.pop() 
        this.setLastNumberToDisplay()
        this.historyCalc = this._operation.join("")
    }  

    getLastOperation(){
        return this._operation[this._operation.length-1]
    }

    isOperator(value){

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1)

    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value
    }

    getLastItem(isOperator = true){
        let lastItem;

        for(let i = this._operation.length-1 ; i >= 0 ; i-- ){
            // 6 + 3 +
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i]
                break
            }

        }

        return lastItem
    }

    getResult(){
        return eval(this._operation.join(""))
    }

    calc(){
        let last
        
        if(this._operation.length < 3){
            
            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator, this._lastNumber]
            this.historyCalc = this._operation.join("")

        }
        
        this._lastOperator = this.getLastItem()

        if(this._operation.length > 3) {
            
            last = this._operation.pop()
            this._lastNumber = this.getResult()

        }else if(this._operation.length == 3){

            this._lastNumber = this.getLastItem(false)

        }

        this.historyCalc = this._operation.join("")

        let result = this.getResult()

        if(last == '%'){

            result /= 100
            this._operation = [result]

        }else{

            this._operation = [result]

            if(last) this._operation.push(last)

        }

        this.setLastNumberToDisplay()
    }

    pushOperation(value){
        this._operation.push(value)

        if(this._operation.length > 3){

            this.calc()
            
        }
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false)

        if(!lastNumber) lastNumber = 0

        this.displayCalc = lastNumber
    }
    
    addOperation(value){
        if(isNaN(this.getLastOperation())){

            if(this.isOperator(value)){

                this.setLastOperation(value)
                this.historyCalc = this._operation.join("")

            }else {

                this.pushOperation(value)
                this.setLastNumberToDisplay()

            }

        }else{

            if(this.isOperator(value)){
                
                this.pushOperation(value)
                this.historyCalc = this._operation.join("")

            }else{

                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(newValue)
                this.setLastNumberToDisplay()

            }

        }

    }

    setError(){
        this.displayCalc = "Error"
    }

    addDot(){
        
        let lastOperation = this.getLastOperation()

        if(typeof lastOperation == 'string' && lastOperation.split("").indexOf('.') > -1){
            return
        }

        if(lastOperation == 0){

            this.setLastOperation(lastOperation.toString() + '.')

        }else if(this.isOperator(lastOperation) || !lastOperation){

            this.pushOperation('0.')

        }else{

            this.setLastOperation(lastOperation.toString() + '.')

        }

        this.setLastNumberToDisplay()

        console.log(lastOperation)

    }

    pasteFromClipboard(e){
        let text = e.clipboardData.getData('Text')

        this.pushOperation(parseFloat(text))
        this.setLastNumberToDisplay()
    }

    copyToClipboard(){
        let input = document.createElement('input')

        input.value = this.displayCalc

        document.body.appendChild(input)

        input.select()

        document.execCommand("Copy")

        input.remove()

    }

    initKeyboard(){
        document.addEventListener("paste", e => {
            this.pasteFromClipboard(e)
        })

        document.addEventListener("keyup", e => {
            switch (e.key) {
                case 'Escape':
                    this.clearAll()
                    break;
                case 'Backspace':
                    this.clearEntry()
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key)
                    break;
                case '.':
                case ',':
                    this.addDot()
                    break;
                case 'Enter':
                    this.calc()
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key))
                    break;

                case 'c':
                    if(e.ctrlKey){
                        this.copyToClipboard()
                    }
                    break;
            }
        })
    }

    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll()
                break;
            case 'ce':
                this.clearEntry()
                break;
            case 'soma':
                this.addOperation('+')
                break;
            case 'subtracao':
                this.addOperation('-')
                break;
            case 'divisao':
                this.addOperation('/')
                break;
            case 'multiplicacao':
                this.addOperation('*')
                break;
            case 'porcento':
                this.addOperation('%')
                break;
            case 'ponto':
                this.addDot()
                break;
            case 'igual':
                this.calc()
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
                break;
            default:
                this.setError()
                break;
        }
    }

    initbuttonsEvents() {
        let buttons = document.querySelectorAll(".buttons button")

        buttons.forEach(btn => {

            btn.addEventListener('click', e => {

                let textBtn = btn.className.replace("btn-", "")

                this.execBtn(textBtn)

            })

        })
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale)
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    get displayTime() {
        return this._timeEl.innerHTML
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value
    }

    get displayDate() {
        return this._dateEl.innerHTML
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value
    }

    get historyCalc() {
        return this._historyCalcEl.innerHTML
    }

    set historyCalc(value) {
        this._historyCalcEl.innerHTML = value
    }

    get currentDate() {
        return new Date()
    }

    set currentDate(value) {
        this._currentDate = value
    }
}