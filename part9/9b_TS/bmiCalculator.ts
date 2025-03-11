function calculateBmi (height:number, weight:number):string {
    const IMC = weight/(height/100)**2
    let result:string;
    if (IMC < 18.5) {
        result = 'Underweight'
    } else if (IMC < 25) {
        result = 'Normal range'
    } else {
        result = 'Overweight (Pre-obese)'
    }
    return result
}

console.log(calculateBmi(180, 74))