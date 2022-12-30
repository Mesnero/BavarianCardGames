1. Button Text fixed height
2. Stich other design
3. Concept on how to programm AI
4. Programm AI
5. Play Card Animation + Stich away animation
6. Difficulties reaching cards (Maybe shrink playing hands with cards)
7. Hide other cards and remove CSS to make them neutral
8. Safe money with cookies and add fixed name

Strategy AI:

Phase 1:
1) If one card is playable, play it
2) If you are the first person, play any lowest (multiple lowest, color with fewer, if same choose random)
3) If you don't have the color, play highest rated card (multiple highest, color with fewer)
4) If you have the same color play the highest rated card, that is lower than the played card
5) If you have the same color and don't have lower cards, play the lowest rated card that is higher


Phase 2:
1) If one card is playable, play it
2) If you are the first player and have a small heart (7,8,9), play it (otherwise, smallest not heart)
3) If you don't have a small heart, play lowest card (multiple lowest, color with fewer)
4) If you don't have the played color, always play highest heart (don't have heart, play highest)
5) If you have the same color play the highest rated card, that is lower than the played card
6) If you have the same color and don't have lower cards, play the lowest rated card that is higher

Phase 3:
1) If one card is playable, play it
2) If you are the first player, play lowest
3) If you have the same color, play the highest rated card, that is lower than the played card (O if possible)
4) If you have the same color, play the lowest rated card, that is higher than the played card (never O)
5) If you don't have the same color, but an O, always play O
6) If you don't have the same color and no O, play the highest rated card
7) If you are last, you only have higher cards, play highest possible (No O)

Phase 4: 
1) If you have the HK:
   1) If one card is playable, play it
   2) If you are first, play low heart (not HK), if no heart, play color with fewest amount
   3) If you don't have the color, play HK
   4) If HA is played before you, play HK
   5) If you have the color played, play highest rated card
2) If you don't have the HK:
   1) If you are first, always play heart (not HA)
   2) If you have the color, play the highest rated card, that is lower than the played card
   3) If you have the color, play the lowest rated card, that is higher than the played card
   4) If one card is playable, play it
   5) If you don't have the color, play the highest rated card
   6) If you have HA and you are last and there is no HK, play it

Phase 5:
1) If you are first, play highest rated card
2) If one card is playable, play it
3) If you have the color, play the highest card
4) If you don't have the color, play the highest card

Phase 6:
1) If one card is playable, play it
2) If you have multiple cards playable, don't play U
3) If you have multiple cards playable, play the card where fewer cards are left to the edge
4) If cards have same amount, random
