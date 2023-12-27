---
title: Fun ChatGPT prompts to improve your Python code
category: Machine Learning
datePublished: "2023-04-23"
dateCreated: "2023-04-23"
---

After a long week in Seattle for the MVP summit, I needed some low level fun on my computer. I got to work on some Python code with GPT-4.
I tried a few prompts for things that I absolutely dislike in Python.

In this post you'll find 4 of the prompts that I tried so you can use them as quality of life improvements in your coding sessions.

Let's get started!

## Prompt idea 1: Writing docstrings

Let's be honest, writing docstring is the last thing you do. Well, no more, you can use GPT-4 for this.

For example, when you have a piece of code like this:

```python
def calculate_costs(loan_amount: int, interest_rate: float, duration_years: int):
    if loan_amount <= 0:
        raise ValueError("loan_amount must be positive")

    if interest_rate <= 0:
        raise ValueError("interest_rate must be positive")

    if duration_years <= 0:
        raise ValueError("duration_years must be positive")

    return loan_amount * pow((1 + interest_rate/100), duration_years)
```

You can get a docstring for it with the following prompt:

```text
Write a python docstring for the following method:

def calculate_costs(loan_amount: int, interest_rate: float, duration_years: int):
    if loan_amount <= 0:
        raise ValueError("loan_amount must be positive")

    if interest_rate <= 0:
        raise ValueError("interest_rate must be positive")

    if duration_years <= 0:
        raise ValueError("duration_years must be positive")

    return loan_amount * pow((1 + interest_rate/100), duration_years)
```

It will generate something along the lines:

```text
Args:
loan_amount (int): The amount of the loan in dollars.
interest_rate (float): The interest rate per year as a decimal.
duration_years (int): The duration of the loan in years.

Returns:
float: The total amount of interest paid over the duration of the loan.

Raises:
ValueError: If loan_amount, interest_rate or duration_years are negative or zero.
```

Looks good, but what if I want numpy style docstrings? Sure you can!

```
Write a python docstring in numpy style for the following method: <method code>
```

Note, you have to add the code for the method instead of the placeholder.
Need another style? Just name your style, and the model will generate that style of comments.

## Prompt idea 2: Writing automated tests

Another nice prompt idea is to write unit-tests for your code. You can do this with the following
prompt:

```
Write unit-tests for the following code:

def calculate_costs(loan_amount: int, interest_rate: float, duration_years: int):
    if loan_amount <= 0:
        raise ValueError("loan_amount must be positive")

    if interest_rate <= 0:
        raise ValueError("interest_rate must be positive")

    if duration_years <= 0:
        raise ValueError("duration_years must be positive")

    return loan_amount * pow((1 + interest_rate/100), duration_years)
```

It will generate code like this:

```python
import unittest

class TestCalculateCosts(unittest.TestCase):

    def test_positive_loan_amount(self):
        self.assertEqual(calculate_costs(10000, 5, 2), 11038.225)

    def test_negative_loan_amount(self):
        with self.assertRaises(ValueError):
            calculate_costs(-10000, 5, 2)

    def test_zero_loan_amount(self):
        with self.assertRaises(ValueError):
            calculate_costs(0, 5, 2)

    def test_positive_interest_rate(self):
        self.assertEqual(calculate_costs(10000, 5, 2), 11038.225)

    def test_negative_interest_rate(self):
        with self.assertRaises(ValueError):
            calculate_costs(10000, -5, 2)

    def test_zero_interest_rate(self):
        with self.assertRaises(ValueError):
            calculate_costs(10000, 0, 2)

    def test_positive_duration_years(self):
        self.assertEqual(calculate_costs(10000, 5, 2), 11038.225)

    def test_negative_duration_years(self):
        with self.assertRaises(ValueError):
            calculate_costs(10000, 5, -2)

    def test_zero_duration_years(self):
        with self.assertRaises(ValueError):
            calculate_costs(10000, 5, 0)

if __name__ == '__main__':
    unittest.main()
```

Pretty cool. It saves a ton of time since it not only makes a basic test, it will actually break down the logic and
write a couple of tests for different paths in the code.

I don't have to tell you that you'll need to use a calculator to verify the numbers here, right?

You can of course choose the python test framework too:

```
Write unit-tests in pytest for the following code:

def calculate_costs(loan_amount: int, interest_rate: float, duration_years: int):
    if loan_amount <= 0:
        raise ValueError("loan_amount must be positive")

    if interest_rate <= 0:
        raise ValueError("interest_rate must be positive")

    if duration_years <= 0:
        raise ValueError("duration_years must be positive")

    return loan_amount * pow((1 + interest_rate/100), duration_years)
```

This will generate the same sort of tests but this time the model uses pytest as the library:

```python
import pytest

from calculate_costs import calculate_costs

def test_positive_loan_amount():
    assert calculate_costs(10000, 5, 2) == 11038.225

def test_negative_loan_amount():
    with pytest.raises(ValueError, match="loan_amount must be positive"):
        calculate_costs(-10000, 5, 2)

def test_zero_loan_amount():
    with pytest.raises(ValueError, match="loan_amount must be positive"):
        calculate_costs(0, 5, 2)

def test_positive_interest_rate():
    assert calculate_costs(10000, 5, 2) == 11038.225

def test_negative_interest_rate():
    with pytest.raises(ValueError, match="interest_rate must be positive"):
        calculate_costs(10000, -5, 2)

def test_zero_interest_rate():
    with pytest.raises(ValueError, match="interest_rate must be positive"):
        calculate_costs(10000, 0, 2)

def test_positive_duration_years():
    assert calculate_costs(10000, 5, 2) == 11038.225

def test_negative_duration_years():
    with pytest.raises(ValueError, match="duration_years must be positive"):
        calculate_costs(10000, 5, -2)

def test_zero_duration_years():
    with pytest.raises(ValueError, match="duration_years must be positive"):
        calculate_costs(10000, 5, 0)
```

## Prompt idea 3: Check your code for optimizations and bugs

Now that we have tests, I think it's a good idea to ask the model to check out my code
for bugs and optimizations. Since I have tests now, I can more easily verify that
the optimizations are correct.

Let's feed it the following prompt:

```text
Can you check the following code for bugs?:

def calculate_costs(loan_amount: int, interest_rate: float, duration_years: int):
    if loan_amount <= 0:
        raise ValueError("loan_amount must be positive")

    if interest_rate <= 0:
        raise ValueError("interest_rate must be positive")

    if duration_years <= 0:
        raise ValueError("duration_years must be positive")

    return loan_amount * pow(duration_years, (1 + interest_rate/100))
```

It will return the following response:

> The code seems fine to me, and the input validation logic appears to be correct. However, there is one minor issue with the function's implementation.<br><br>
> The `pow()` function used to calculate the power of the duration years to `(1 + interest_rate/100)` can sometimes return a floating-point result. Since the function's return type is specified as an `int`, it might lead to incorrect results.<br><br>
> To fix this issue, you can cast the result of the `pow()` function to an `int`. Here's the updated code:

The code returned looks like this:

```python
def calculate_costs(loan_amount: float, interest_rate: float, duration_years: int) -> int:
    if loan_amount <= 0:
        raise ValueError("loan_amount must be positive")

    if interest_rate <= 0:
        raise ValueError("interest_rate must be positive")

    if duration_years <= 0:
        raise ValueError("duration_years must be positive")

    return int(loan_amount * pow((1 + interest_rate/100), duration_years))
```

Almost correct. I want to return floats because costs are expressed in euros here.
I guess the function didn't mention this. Let's tell the model:

```
I want to return the result as a float
```

The model will now change the function a bit, and remove the int cast.

```python
def calculate_costs(loan_amount: int, interest_rate: float, duration_years: int) -> float:
    if loan_amount <= 0:
        raise ValueError("loan_amount must be positive")

    if interest_rate <= 0:
        raise ValueError("interest_rate must be positive")

    if duration_years <= 0:
        raise ValueError("duration_years must be positive")

    return loan_amount * pow((1 + interest_rate/100), duration_years)
```

## Prompt idea 4: Refactor a method

I remember that the model returned something about using the `**` operator instead of using
the `pow` function. Let's see if we can refactor the code.

Let's give the following prompt:

```text
Can you refactor this method replacing pow with the ** operator?

def calculate_costs(loan_amount: int, interest_rate: float, duration_years: int) -> float:
    if loan_amount <= 0:
        raise ValueError("loan_amount must be positive")

    if interest_rate <= 0:
        raise ValueError("interest_rate must be positive")

    if duration_years <= 0:
        raise ValueError("duration_years must be positive")

    return loan_amount * pow((1 + interest_rate/100), duration_years)
```

The model will return the following code:

```python
def calculate_costs(loan_amount: int, interest_rate: float, duration_years: int) -> float:
    if loan_amount <= 0:
        raise ValueError("loan_amount must be positive")

    if interest_rate <= 0:
        raise ValueError("interest_rate must be positive")

    if duration_years <= 0:
        raise ValueError("duration_years must be positive")

    return loan_amount * ((1 + interest_rate/100) ** duration_years)
```

Refactoring with a language model, not bad at all!

## Summary

Large language models are a great tool for some of the more mundane programming tasks.
I can highly recommend running a few of the prompts against your own code to see what the
result looks like.

A friendly word of warning though. It is a language model, not a calculator. I highly recommend
verifying the generated code to see if the numeric results are correct. GPT-4 sometimes fails
to correctly generate logic as well, so the unit-tests are suspect.

However, even with these limitations, using GPT-4 for coding is a great time saver.

See you next time!
