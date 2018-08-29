---
title: How Many Hoops Will Kids Jump Through To Play Rock, Paper, Scissors? 
---

# How Many Hoops Will Kids Jump Through To Play Rock, Paper, Scissors?

> ([source](https://fivethirtyeight.com/features/how-many-hoops-will-kids-jump-through-to-play-rock-paper-scissors/))
>
> From Taylor Firman, the bell rings and it’s time for gym:
> 
> The following delightful video has been making the viral rounds:
>
> [https://youtu.be/PcIord7RNAI](https://youtu.be/PcIord7RNAI)
>
> Let’s call this game rock-paper-scissors-hop. Here is an idealized list of its rules:
>
>    - Kids stand at either end of N hoops.
>    - At the start of the game, one kid from each end starts hopping at a speed of one hoop per second until they run into each other, either in adjacent hoops or in the same hoop.
>    - At that point, they play rock-paper-scissors at a rate of one game per second until one of the kids wins.
>    - The loser goes back to their end of the hoops, a new kid immediately steps up at that end, and the winner and the new player hop until they run into each other.
>    - This process continues until someone reaches the opposing end. That player’s team wins!
>
> You’ve just been hired as the gym teacher at Riddler Elementary.
> You’re having a bad day, and you want to make sure the kids stay occupied
> for the entire class. If you put down eight hoops, how long on average
> will the game last? How many hoops should you put down if you want the
> game to last for the entire 30-minute period, on average?
>
> To get you started, here’s how a single game might unfold:
>
> ![Example Game Simulation]({{ "/assets/images/RockPaperScissorsHop.gif" | absolute_url }})

---

<div id="game"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.4.2/umd/react.production.min.js" integrity="sha256-2EQx5J1ux3sjgPLtDevlo449XNXfvEplcRYWIF6ui8w=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.4.2/umd/react-dom.production.min.js" integrity="sha256-3NNU/yoE0R7VxxapKiw/hkgQzcSMztyclb5RpeVlV7Y=" crossorigin="anonymous"></script>

<script>
    // Load in `Game` component
    {% include 2018-08-24-how-many-hoops-will-kids-jump-through-to-play-rock-paper-scissors.js %}

    document.addEventListener('DOMContentLoaded', function() {
        const container = document.getElementById('game');
        ReactDOM.render(React.createElement(Game), container);
    });
</script>

