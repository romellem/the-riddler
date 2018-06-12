---
title: The Case Of The Smudged Secret Message
---

# The Case Of The Smudged Secret Message

> ([source](https://fivethirtyeight.com/features/the-case-of-the-smudged-secret-message/))
>
> From Ben Gundry via Eric Emmet, find and replace with a twist:
> 
> Riddler Nation has been enlisted by the Pentagon to perform crucial (and arithmetical)
> intelligence gathering. Our mission: decode two equations. In each of them, every
> different letter stands for a different digit. But there is a minor problem in both equations.
>
> In the first equation, letters accidentally were smudged on their clandestine journey to
> a safe room within Riddler Headquarters and are now unreadable. (These are represented
> with dashes below.) But we know that all 10 digits, 0 through 9, appear in the equation.
>
>         E X M R E E K
>     +   E H K R E K K
>     -----------------
>       - K - H - X - E
>
> What digits belong to what letters, and what are the dashes?

---

## Solution

OK, so first off, I feel like it is easier on my brain if I use consecutive letters
of the alphabet rather than the random X, M, R, etc.

So, using `A`, `B`, `C`, `D`, `E`, and `F`, and adding thousand separators where necessary,
we get

        A , B C D , A A E
    +   A , F E D , A E E
    ---------------------
      - E , - F - , B - A

Next thing to notice is that we have the digits `A` through `F`, which means the letters
correspond to six different digits. From the instructions, we know "all 10 digits,
0 through 9, appear in the equation." Because there are four "dashes" in the final sum,
that means that all those dashes have to be unique, so our `A` through `F` plus the
dashes add up to using all 10 digits, 0 through 9.

Since the dashes are all unique, let's just assign them their own variable letters:

        A , B C D , A A E
    +   A , F E D , A E E
    ---------------------
      G E , H F I , B J A

OK, so the first thing I notice is that we are adding two seven digit numbers and getting
an _eight_ digit sum. That means that the first digit of our sum is a **1**, or rather:

- `G` _has_ to be **1**.

Let's fill that in

        A , B C D , A A E
    +   A , F E D , A E E
    ---------------------
      1 E , H F I , B J A

Sticking with that "two seven digit numbers summing to an _eight_ digit sum" idea,
the first digit of each term is the same (an `A`), so that tells me `A` has to be
a **5**, **6**, **7**, **8**, or **9**.

Think about it, say `A` was a 4. Ignore the fact that the numbers after it vary, let's
make a 7 digit number that starts with 4 be the larger possible: we get _4,999,999_.
4,999,999 + 4,999,999 = _9,999,998_, which is obviously not an eight digit number.
This thought is similar for a seven digit number that starts with 3, 2, or 1. So, we know
`A` is a 5 or greater.

Next thing I notice, is the last digit of our two terms is the same, they are both `E`s.
Plus, they add up to a digit who's last digit is `A`! This is important because, `E + E`
is the same just writing `2E`, which means `E + E` is an _even_ number.

We don't know if `E + E` is a one digit or two digit number, but its _last_ digit has to
be even. We know its last digit is `A`, so `A` has to be even.

Thus our list for potential digits of `A` just got way shorter.

Now we know `A` is either a **6** or and **8**.

OK, let's guess **8**. So `E + E` has to sum to a one or two-digit number that ends in 8.
That means our choices are `E + E = 8` or `E + E = 18`, which corresponds to `E` is either
**4** or **9**, respectively.

However, look at our sum. We know the second digit is `E`! So, if `E` is a **4** or a **9**,
then some number _8,xxx,xxx_ (_note_: _x_ is just a placeholder for any digit, it doesn't
matter what at this point) plus some other number _8,xxx,xxx_ has to sum to an eight digit
number where the second digit is a **4** or **9**.

Think about that, there is no such number! 8,xxx,xxx + 8,xxx,xxx has to equal
_16,xxx,xxx_ or _17,xxx,xxx_. AKA, the second digit _has_ to a **6** or a **7**!

This can be shown through a similar approach to when we figured out that `A` had to be a
**5** or greater: take the smallest two seven-digit numbers that begin with 8: _8,000,000_.
8,000,000 + 8,000,000 = _16,000,000_, yielding an eight-digit number where the second digit
is a **6**. Next, take the two largest seven-digit numbers that begin with 8: _8,999,999_.
8,999,999 + 8,999,999 = _17,999,998_, yielding an eight-digit number where the second digit
is a **7**. So by induction, any seven-digit number that begins with an 8 _has_ to have
a second digit of either **6** or **7**, but from above, the only valid choices for
`E` are **4** or **9**!

That means we have a contradiction, so `A` _can't be_ an **8**.

OK, so by process of eliminitation:

- `A` _has_ to be **6**

Let's fill that into our equation:

        6 , B C D , 6 6 E
    +   6 , F E D , 6 E E
    ---------------------
      1 E , H F I , B J 6

Looks good so far, now let's look at `E`. Using similar logic from before, `E + E` has to end in
a **6**, so that means we solve `E + E = 6` or `E + E = 16`, meaning `E` is **3** or **8**.

Borrowing again from logic above, we know the second digit of our sum (that is, `E`)
has to be either a **2** or a **3**.

That means, looking at the intersection of our two possible lists, we have determined that

- `E` _has_ to be **3**

Fill that into our equation:

        6 , B C D , 6 6 3
    +   6 , F 3 D , 6 3 3
    ---------------------
      1 3 , H F I , B J 6

We have enough digits to fully calculate what `B` and `J` are! Doing the math, we find that:

- `J` _has_ to be **9**
- `B` _has_ to be **2**

Once again, filling that into the equation gives us:

        6 , 2 C D , 6 6 3
    +   6 , F 3 D , 6 3 3
    ---------------------
      1 3 , H F I , 2 9 6

Note that there is an imaginary _1_ floating in the thousand's place that got carried
over from the 663 + 633 = _1_,296. This isn't super useful at the moment, but we'll use it later.

Ignoring that for now, what is the next obvious step? Well, remember, our full equation has to use
0 through 9, with each number assigned to a unique variable `A` through `J`. We've already used
a fair amount of digits, let's see what is left. 

We've used 1, 2, 3, 6, and 9 so far. That leaves:

_Unused digits_:  
- 0
- 4
- 5
- 7
- 8

Nothing super obvious is jumping out, but there is another thing we can determine.
Let's look at the second digit of the second term: `F`.

We know that 6,xxx,xxx + 6,xxx,xxx has to sum to 13,xxx,xxx. That means that the second
digits of each of our terms _has_ to sum to 10 or greater, so we can "carry" the 1 into
the second digit of our sum!

Put a little more concretely, if we had

        6 , X - - , - - -
    +   6 , Y - - , - - -
    ---------------------
      1 3 , - - - , - - -

Then `X + Y` is greater than or equal to `10`.

We already know the second digit of the first term: it is **2**. That means, the second digit
of the second term is either **8** or **9**. Looking at list of unused digits above, only
**8** is available, so we've solved another digit! Namly:

- `F` _has_ to be **8**

Filling that in:

        6 , 2 C D , 6 6 3
    +   6 , 8 3 D , 6 3 3
    ---------------------
      1 3 , H 8 I , 2 9 6

Let's look at the third digit of our sum: `H`. We can see from the **2** and the **8** that
it has to be a **0** or a **1** (in the case `C + 3` results in a ten's place digit carrying over).
However, we've already used **1**, so that means:

- `H` _has_ to be **0**

Getting close! So far we have:

        6 , 2 C D , 6 6 3
    +   6 , 8 3 D , 6 3 3
    ---------------------
      1 3 , 0 8 I , 2 9 6

We have three digits left to figure out. Sliming down our _unused_ list from before means we now have:

_Unused digits_:  
- 4
- 5
- 7

Let's look at `D`. Since we only have three digits remaining, let's just plug each of them
(4, 5, and 7) into `D` and see if any give us a contradiction. Remember the _1_ we had to carry before into the thousand's place?

                
                1 <- carried over
                |  \
        6 , 2 C D , 6 6 3
    +   6 , 8 3 D , 6 3 3
    ---------------------
      1 3 , 0 8 I , 2 9 6

Let's make sure we don't forget that when doing the arithmetic.

Starting down the line, what if `D` equaled **4**?

      1 + D + D
    = 1 + 4 + 4
    = 9

That would correspond with `I` being equal to **9**, but **9** isn't available,
so `D` can't equal **4**.

Next, what if `D` equaled **5**?

      1 + D + D
    = 1 + 5 + 5
    = 11

That would correspond with `I` being equal to **1**, but again **1** isn't available,
so `D` can't equal **5**.

By process of elimintation, that means that

- `D` _has_ to be **7**

Filling that in, we get:


        6 , 2 C 7 , 6 6 3
    +   6 , 8 3 7 , 6 3 3
    ---------------------
      1 3 , 0 8 I , 2 9 6

We can now fill in `I`, which shows that:

- `I` _has_ to be **5**

Almost done, we have:

        6 , 2 C 7 , 6 6 3
    +   6 , 8 3 7 , 6 3 3
    ---------------------
      1 3 , 0 8 5 , 2 9 6

And last but not least, we have only have `C` remaining, which means:

- `C` _has_ to be **4**

Finally, filling that in gives us:

## Answer

        6 , 2 4 7 , 6 6 3
    +   6 , 8 3 7 , 6 3 3
    ---------------------
      1 3 , 0 8 5 , 2 9 6
