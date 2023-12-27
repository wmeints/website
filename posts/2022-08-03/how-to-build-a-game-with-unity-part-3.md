---
title: How to build a game with Unity - Part 3
category: Unity
datePublished: "2022-08-03"
dateCreated: "2022-08-03"
---

Welcome to this series of blog posts about building a game with Unity.
In this series we're going to explore a fun vacation project that my son and I
worked on in summer 2022.

In this blogpost we'll discuss how to add an animated player character to the
game. We'll cover the following topics:

- Importing sprites for animated characters
- Adding an animated sprite to the game
- Controlling the animated sprite using a keyboard
- Using animators to control the animation

Let's get started by importing sprites for the player character.

## Importing sprites for animated characters

In the previous blogpost we discussed how to set up sprites in Unity to design
a level. This is not the only usage for sprites. You can use them for other
things too. For example, you can turn a set of sprites into a player character.

Let's import the image that will contain the sprites for our game character.
If you haven't done so, you can download [the asset pack][ASSET_PACKAGE] to get
the images we're using on your own machine.

From the asset pack, we're going to be importing _Characters/Basic Charakter Spritesheet.png_
into the project. Follow these steps to import the asset:

1. Navigate to the _Resources_ folder in the _Project_ window
2. Right click inside the new directory and choose _Import New Asset_
3. Navigate to the image and load it in the project.

After importing the new sprite, we need to modify the sprite so we can use it in
our character. Select sprite and set the properties like so:

- _Sprite Mode_: Multiple
- _Pixels per unit_: 16
- _Extrude edges_: 0
- _Filter Mode_: Point

Click apply to save the settings for the sprite.

Next, you need to slice the sprite to get the individual poses of the player
character. In the _Inspector_ window, click on the _Sprite editor_ button to
open the sprite editor.

In the _Sprite editor_ click the _Slice_ button and use the following settings
to slice the sprite.

- _X_: 48
- _Y_: 48

Click the _Slice_ button to slice the sprite. Then, click the _Apply_ button
inside the _Sprite editor_ to save the changes.

Now that we've imported and sliced the sprite, we can animate the sprite in
the game.

## Adding the player to the scene

Before we can animate a sprite, we need an object that will represent the
player. There are various ways to create a new object. Instead of dragging an
asset from the _Project_ window, we're going to create an empty object.

Right click on the _Scene_ window and choose _Create empty_ to create a new
object. Name it _Player_. This new empty object we'll expand with various
components to turn it into a player controlled character.

Let's start by adding a basic animated character.

## Adding an animated sprite to the game

Creating an animated sprite in the game is done by dragging two or more cells
from a sprite onto the scene.

In the _Project_ window, expand the character sprite. You should now see the
individual poses of the character.

![Expanded sprite with all the individual poses](/content/images/2022/08/03/expanded-sprite.png)

Select the first 4 poses in the sprite we just expaned and drag them onto the
scene. This will open a file dialog to save the animation we've just created.
Create a new folder _Animations_ in the project and save the animation in the
folder. Give the animation the name _Player_Idle_.

By dragging the sprites, we created two things:

- An animation with the name _Player_Idle_
- An animator that controls which animation is currently playing.

To make it easier to see the character in the editor, we need to take one more
step. We need to configure a sprite for the sprite renderer.

First, select the Player object in the _Hierarchy_ window. Then, drag the
first image from the character sprite in the _Project_ window onto the
_Sprite_ field of the sprite renderer component in the _Inspector_ window.

You can now see the player character in the scene.

When you start the game with the _Play_ button at the top of the screen, you'll
see the bunny animating in the middle of the level.

The animation is a bit fast, but we'll fix that by editing the animation.
Click the _Play_ button again to stop the game, so we can edit the animation.

To edit the animation, we'll need to open the animation window. You can do this
by going to the menu _Window -> Animation -> Animation_. You can drag the window
to the right of the _Project_ window.

![Editor window with animation panel docked](/content/images/2022/08/03/editor-with-animations-panel.png)

In the _Animation_ window, enable the sample rate editor so we can change the
speed at which the animation plays.

![Enable sample rate settings](/content/images/2022/08/03/show-sample-rate.png)

You can set this value to anything you like. Higher numbers indicate the
animation will play faster. Lower numbers indicate the animation will play
slower.

For the bunny animation, we're going to slow the animation to a sample
rate of 6.

After setting up the first animation, we can start to work on the script that's
going to control the character.

## Controlling the animated sprite using a keyboard

So far, our player has been just an animated picture. Now it's time to turn
it into an interactive character.

We need to perform two tasks for this:

- We need to set up a rigid body, so we can control the speed of the character.
- We need to set up a script to convert user input into a velocity for the rigid body.

Let's start by setting up a rigid body.

### Setting up the rigid body for the character

Unity has a pretty nice physics system in the game engine that we can use to
implement various game interactions. The physics system can handle rigid bodies
like objects and sprites. It can also handle ragdoll physics which is used to
control 3D characters.

We're going to be using rigid body physics for our game since we don't have
anything 3D in the game.

Select the Player object in the _Hierarchy_ window, and follow these steps
to set up a rigid body:

1. In the _Inspector_ window, add a new component and search for _Rigid Body 2D_
2. Set the _Gravity scale_ property to 0. Otherwise, the character will float off screen.

Next, we're going to work on the script that will control the player.

### Controlling the player character with code

So far, we've been dragging and dropping assets and editing properties. That's
about to change. We're going to write a bit of C#.

I think this is one of the most powerful things of Unity. You don't need to write
a ton of code to write a game. And what you write is very sensible.

We're going to write a small script that takes user input and translates it into
movement of the player game object.

There are two options to control object movement. You can set it's position or
you can set the velocity and let the game handle the positioning.

We're going to use velocity to control the player movement. Using velocity works
better because we can let the game control how to handle things like the player
hitting a wall.

We don't have a wall yet, but we will in the next blogpost. So this is a bit
of a preparation step for that.

Follow these steps to create the script behavior:

1. Right click the _Project_ window and create a new folder called _Scripts_.
2. Right click in the _Scripts_ folder and choose _Create -> C# Script_.
3. Give the script the name _PlayerController_

Double-click on the script to open it in your configured code editor.
Add the following content to the script:

```csharp
public class PlayerController : MonoBehaviour
{
    public float speed;
    public Rigidbody2D rigidBody;

    void Update()
    {
        var horizontal = Input.GetAxisRaw("Horizontal");
        var vertical = Input.GetAxisRaw("Vertical");

        var movement = new Vector2(horizontal, vertical);

        rigidBody.velocity = movement * speed;
    }
}
```

Let's go over what the script does. The script accepts two variables:

- speed: This controls how fast the character can walk in the game.
- rigidBody: The rigid body that we're controlling.

We've added one method called `Update` to the script. The `Update` method is
called each frame. In this method, we need to write code that we want to run
whenever a frame is rendered.

In the `Update` method, we first retrieve the horizontal and vertical axis
value. This axis is controlled by your keyboard, XBox controller, Playstation
controller, or joystick. The value for the horizontal and vertical axes can be
between -1 and +1 depending on the direction. Down and left are the positive
sides of the axes.

After getting the direction of the force we want to apply we construct a new
2D-vector based on the axis values.

Finally, we multiply the new movement vector with the speed and apply it as
the velocity vector for the rigid body.

Now that we have the script, let's attach it to the player.

In the unity editor, select the player object in the _Hierarchy_ window, and
follow these steps to assign the behavior to the player:

- Add a new component in the _Inspector_ window. Search for _PlayerController_.
- Next, drag the _Rigid Body 2D_ component from the inspector on top of the _rigidBody_ field of the component we just added.
- Finally, set a value for the _speed_ field in the _PlayerController_ component.

Start the game, and try to move around. The player object will move around
the level. It will only play the idle animation at this point, so we need to
wire up a few more things.

## Using animators to control the animation

In the fhe final part of this post, we're going to expand the player object
with a few more animations.

### Adding more animations to the player

First things first, we need animations for the following movements:

- Walking left
- Walking right
- Walking up
- Walking down

We can create these by following these steps:

1. In the _Hierarchy_ window, select the player object.
2. In the animation window, click on the dropdown where it says _Player_Idle_
   and choose _Create new clip_.
3. Give the new animation a good name, for example: Player_Walk_Left.
4. In the _Project_ window, expand the _Resources_ folder and the _Basic Charakter Spritesheet_
5. Drag the 4 images where the character is facing to the left onto the animation window.
6. Set the sample rate to 6 so the animation matches the first animation we created.

Repeat the 6 steps for each of the directions.

We've now expanded the player object with more animations. The game won't use
them yet as we have to modify the animator. Let's do that next.

### Prepare the animator for more complex animations

Animations are controlled by an animator in Unity. The animator is a state
machine that accepts inputs and maps those inputs to various animation states.

You can do some pretty complex things, like layering and blending animations.

We're going to build a basic movement animator by blending animations. Before we
can do that, we need to prepare the animator.

Open up the animator window. Go to the menu _Window -> Animation -> Animator_.
You can dock this window in the middle of the screen.

![Editor with animator window](/content/images/2022/08/03/animator-window.png)

Initially, the window will display all of the animations in the animator window.
You can remove all animations except the _Player_Idle_ animation from the window.
We're left with an animator that will immediately start playing the idle
animation.

Let's add a few inputs for the animator to respond to. We need two things:

- A parameter that controls whether the player is moving.
- Next, a paramater that determines the horizontal direction.
- Finally, a parameter that determines the vertical direction.

The first parameter is used to switch between idle and moving. The second, and
third parameter are used to determine which animation to play while moving.

To add the parameters, switch to the _Parameters_ tab inside the _Animator_
window. Next, click the _+_ sign and choose _Float_. Name the parameter _Speed_.

Repeat the process to add a parameter two more times for _HorizontalMovement_
and _VerticalMovement_.

Now that we have the parameters, we can start working on expanding the animator.

### Adding a blend tree to the animator

We're going to use a tool in the animator that allows you to blend animations.
The way unity does this is by using a blend tree. Blend trees can be used to
blend two or more animations in 2D or 3D. We're going to use the 2D blend tree
for now.

Right click the animator window, and choose _Create state -> From New Blend Tree_.
Next, double click the Blend Tree to open up the details for it.

Follow these steps to set up the blend tree for the walking animation:

1. In the _Inspector_ window, set the Blend type to 2D simple directional.
2. Click the _+_ button in the _Motion section_ and add a _Motion field_ until you have 4 entries.
3. Then, from the _Project_ window, drag the animations from the _Animations_ folder in the following
   order: Up, Down, Left, Right onto the motion fields.

Now we need to configure the position of each of the animations.

- For the up animation, set the _Pos Y_ field to _1_ and the _Pos X_ field to 0.
- For the down animation, set the _Pos Y_ field to _-1_ and the _Pos X_ field to 0..
- For the left animation, set the _Pos X_ field to _-1_ and the _Pos Y_ field to 0.
- For the right animatino, set the _Pos X_ field to _1_ and the _Pos Y_ field to 0.

To complete the blend tree, we need to configure the X and Y input. We can
set the Parameters field at the top of the inspector to _HorizontalMovement_,
and _VerticalMovement_ respectively.

After completing the blend tree, you should have a blend tree that looks like
this in the inspector window.

![2D Blend tree with all parameters configured](/content/images/2022/08/03/blend-tree-step-02.png)

You can test the blend tree by dragging the red dot in the middle of the blend
tree view inside the _Inspector_ window. Make sure you click _Play_ at the
bottom of the inspector to see the animation in action.

Let's get back to the main animator window to complete the animator
configuration. You can do this by clicking on the _Base layer_ in the animator
window.

![Base layer highlighted in the animator window](/content/images/2022/08/03/base-layer-highlight.png)

We need to configure the animator to transition into the blend tree when we're
moving, and into idle when we're not.

### Configuring transitions

To configure the transition between idle, and moving, we need to first add
a transition from idle to the blend tree.

Right click the _Player_Idle_ state, and choose _Make transition_. Now click
on the _blend tree_ component that we created earlier.

Select the transition. With the transition selected, change the following
settings in the _Inspector_ window.

- Disable _Has exit time_ setting.
- Expand the _Settings_ underneath the _Has exit time_ setting and set
  the _transition duration_ to 0.
- Add a new condition to the list of conditions by clicking the _+_ button.
- Choose _Speed_ from the first dropdown, and _Greater_ from the second dropdown.
- Set the value for the condition to _0.01_.

Add another transition from the _Blend tree_ to the _Player_Idle_ state.
Configure the same settings as before for the second transition.

For the condition of the second transition choose the following:

- _Parameter_: Speed
- _Condition_: Less
- _Value_: 0.01

You should end up with the animator looking like the image below.

![Fully configured animator](/content/images/2022/08/03/animator-window.png)

Now that we have the animator set up, let's wire it up to the _PlayerController_
behavior that we created earlier.

### Wiring the player controller to the animator

To connect the animator to the PlayerController, we need to edit the C# script
we created earlier. You can open it again by double clicking on the script in
the _Project_ window.

Update the script so it has the following content:

```csharp
public class PlayerController : MonoBehaviour
{
    public float speed;
    public Rigidbody2D rigidBody;
    public Animator animator;

    void Update()
    {
        var horizontal = Input.GetAxisRaw("Horizontal");
        var vertical = Input.GetAxisRaw("Vertical");

        var movement = new Vector2(horizontal, vertical);

        rigidBody.velocity = movement * speed;

        // Added to update the animator.
        animator.SetFloat("HorizontalMovement", horizontal);
        animator.SetFloat("VerticalMovement", vertical);
        animator.SetFloat("Speed", movement.sqrMagnitude);
    }
}
```

First, we've added a new public field for the animator. Then, we've added
code to update the parameters of the animator with the horizontal, and vertical
movement speed, and the magnitude of the movement vector.

We're using the square magnitude as a performance optimization. You won't notice
this as much in a small game. But the performance difference between magnitude
and square magnitude can be quite large in bigger games.

After updating the script, go back to the Unity editor and follow these
steps to connect the animator to the player controller:

1. Select the Player object in the _Hierarchy_ window.
2. Drag the animator component in the _Inspector_ window to the _animator_ field
   of the PlayerController inside the _Inspector_ window.

Now you can start the game and it will allow you to move around with the right
animations.

## Summary

In this post we've covered how to set up a player character for the game. We've
also spend quite a bit of time on animations and controlling the animations
based on the actions taken by the player.

As you may have noticed during testing, the game doesn't stop you from going off
the tilemap and you can walk through walls. We're going to fix that in the
next blogpost where we'll talk about collisions.

[ASSET_PACKAGE]: https://cupnooble.itch.io/sprout-lands-asset-pack
