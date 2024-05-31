import {Deck, Card, Placeholder} from './deck.js';

let deck = new Deck([{suit: 'spades', symbol: '♠'}]);
for (let i = 0; i < 8; i++) {
    let d = new Deck([{suit: 'spades', symbol: '♠'}])
    deck.add_deck(d);
}
console.log(deck.cards.length)

deck.shuffle();



let deck_view = Card.get_card_image(0, 0);

deck_view.element.addEventListener('click', () => {
    // Draw cards

    draw_from_deck()
})

document.body.appendChild(deck_view.element);

let piles = []

for (let i = 0; i < 10; i++) {
    let placeholder = new Placeholder();
    let view = placeholder.render(100 * (i + 1))
    document.body.appendChild(view.element)

    piles.push({
        cards: [],
        view: view
    })
}



for (let i = 0; i < 8; i++) {
    draw_from_deck(true)
}
draw_from_deck()

function draw_from_deck(face_down = false) {
    if (deck.cards.length == 0) {
        return
    }

    for (let i = 0; i < piles.length; i++) {
        // Check if the deck still has cards
        if (deck.cards.length == 0) {
            deck_view.element.remove()
            deck_view = null
            return
        }

        let dest_x = piles[i].view.x;
        let dest_y = piles[i].view.y + ((piles[i].cards.length + 1) * 50)

        let c = deck.draw_card();
        if (face_down) {
            c = c.render_face_down(deck_view.x, deck_view.y)
        } else {
            c = c.render(deck_view.x, deck_view.y)
            setTimeout(() => {
                c.make_draggable(() => {
                    // Check which pile we are over!
                    let current_pile = Math.floor((c.last_mouse_x / 100) - 1)
                    if (current_pile >= 0 && current_pile < piles.length) {
                        // Check if the card is valid
                        let pile = piles[current_pile]
                        let last_card = pile.cards[pile.cards.length-1].card
                        console.log(last_card.num_value, c.card.num_value)
                        if (last_card.num_value - 1 == c.card.num_value) {
                            pile.cards.push(c.card)
                            let prev_pile = piles[i]
                            prev_pile.cards.pop()


                            let next_card = prev_pile.cards[prev_pile.length-1];
                            if (next_card.face_down) {
                                // prev_pile.cards[prev_pile.length-1] = 
                            }

                        } else {
                            c.reset_to_original()
                        }
                    } else {
                        c.reset_to_original()
                    }

                })
            }, 500)
        }
        
        
        piles[i].cards.push(c)
        document.body.appendChild(c.element)
        setTimeout(() => {
            c.set_pos(dest_x, dest_y)
        }, 100)
    
    }
}