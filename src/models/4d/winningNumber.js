export class winningNumber {
    constructor(number, prize, draw_id, date){
        this.number = number;
        this.prize = prize;
        this.draw_id = draw_id;
        this.date =date;
    }
    get(){
        return {
            number: this.number,
            prize: this.prize,
            draw_id: this.draw_id,
            date: this.date
        }
    }

}