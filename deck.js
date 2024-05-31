export const suits = [
    {suit: 'clubs', symbol: '♣'},
    {suit: 'hearts', symbol: '❤'},
    {suit: 'spades', symbol: '♠'},
    {suit: 'diamonds', symbol: '♦'}
]

export const values = ['A', '2', '3', '4', '5', 
'6', '7', '8', '9', '10', 'J', 'Q', 'K', ]

export const special_names = {
    'A': "Ace",
    'K': "King",
    'Q': "Queen",
    'J': "Jack"
}

export class Deck {
    constructor(suits = suits) {
        this.cards = []
        for (let i = 0; i < values.length; i++) {
            for (let s = 0; s < suits.length; s++) {
                let card = new Card(
                    suits[s].suit,
                    values[i]
                )
                this.cards.push(card)
            }
        }
    }

    shuffle() {
        // Run through each card, randomly swapping it with another
        // Some cards may be swapped more than once. Some cards may
        // not move, but that's okay. That should be a possibility.
        for (let i = 0; i < this.cards.length; i++) {
            let random_spot = random_int(0, this.cards.length);
            
            // Perform the swap
            let temp = this.cards[random_spot]
            this.cards[random_spot] = this.cards[i]
            this.cards[i] = temp;
        }
    }
    
    add_deck(deck) {
        this.cards = this.cards.concat(deck.cards)
    }

    toString() {
        let string = this.cards.reduce((prev, current) => {
            return prev + "\n" + current.toString()
        })
        return string;
    }

    draw_card() {
        let card = this.cards.pop()
        return card
    }
}

export class Placeholder {
    constructor() {
        
    }

    render(x=0, y=0) {
        let element = document.createElement('div')
        element.classList.add('card_placeholder')
        let controller = new Controller(element, x, y);
        controller.placeholder = this;
        return controller;
    }
}

export class Controller {
    constructor(element, x, y) {
        this.element = element;
        this.set_pos(x, y);
        this.element.top = 0;
        this.element.left = 0;
    }

    set_pos(x, y) {
        this.x = x;
        this.y = y;
        // this.element.setAttribute('style', `translate(${x}px, ${y}px)`)
        if (x == 0 && y != 0) {
            this.element.style.transform = `translateY(${y}px)`;
        } else if (x != 0 && y == 0) {
            this.element.style.transform = `translateX(${x}px)`;
        } else if (x != 0 && y != 0) {
            this.element.style.transform = `translate(${x}px, ${y}px)`;
        }
    }

    make_draggable(on_release) {
        this.element.style.transition = '0s';
        this.element.addEventListener('mousedown', (e) => {
            this.original_x = this.x;
            this.original_y = this.y;
            console.log('click')
            this.element.style.zIndex = '1000';

            this.last_mouse_x = e.clientX;
            this.last_mouse_y = e.clientY;
            document.onmousemove = (e) => {
                let deltaX = this.last_mouse_x - e.clientX;
                let deltaY = this.last_mouse_y - e.clientY;
                this.last_mouse_x = e.clientX;
                this.last_mouse_y = e.clientY;
                

                this.set_pos(this.x - deltaX, this.y - deltaY);
            }
            document.onmouseup = (e) => {
                document.onmouseup = null;
                document.onmousemove = null;
                this.element.style.zIndex = null;
                on_release(this)
            }
        })
    }

    reset_to_original() {
        this.set_pos(this.original_x, this.original_y);
    }
}

export class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;

        // Find the symbol
        suits.forEach(s => {
            if (s.suit == this.suit) {
                this.symbol = s.symbol;
            }
        })
    }

    static get_card_image(x=0, y=0) {
        let element = document.createElement('div')
        element.classList.add('card', 'card_back')

        let controller = new Controller(element, x, y);
        return controller;
    }

    render_face_down(x=0, y=0) {
        let element = document.createElement('div')
        element.classList.add('card', 'card_back')

        let controller = new Controller(element, x, y);
        controller.card = this;
        controller.is_face_down = true;
        return controller;
    }

    get num_value() {
        return values.indexOf(this.value);
    }

    render(x=0, y=0) {
        let element = document.createElement('div')
        element.classList.add('card', 'card_front')
        element.innerHTML = `<div>
            <div> ${this.value}</div>
            <div>${this.symbol}</div>
        </div>
        
        <div>
            😀
        </div>
    
        <div>
            <div> ${this.value}</div>
            <div>${this.symbol}</div>
        </div>`;
    
        if (this.suit == 'hearts' || this.suit == "diamonds") {
            element.classList.add('card_red')
        }
    
        // element.setAttribute('draggable', 'true')
        let controller = new Controller(element, x, y);
        controller.card = this;
        controller.is_face_down = false;
        return controller;
    }

    toString() {
        let name = this.value;
        if (name in special_names) {
            name = special_names[name]
        }
        return `${name} of ${this.suit}`
    }
} 

export function random_int(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

// Returns either true or false
export function random_coin() {
    return Math.random() > 0.5;
}


