---
title: >-
  Building a passwordless login flow with WebAuthn and the Feitian ePass FIDO2
  Key
category: .NET
datePublished: "2022-08-13"
dateCreated: "2022-08-13"
---

A few weeks ago, I received a request to do an honest review of the Feitian ePass FIDO2 Key. I don't usually write
product reviews. But I figured: This is an excellent reason to write a login system with just a FIDO2 USB key for logging
in.

In this blog post, I'll talk you through the experience with WebAuthn and the Feitian ePass FIDO2 Key. We'll cover
the following topics:

- What is WebAuthn?
- Using the Feitian ePass FIDO2 Key
- Content of the demo

Let's get started!

## What is WebAuthn?

Before I start talking about the Feitian ePass FIDO2 Key. It's good to have a short discussion about what WebAuthn is
and what makes it interesting when you're building a web application.

We've used usernames and passwords to log in to our computers and web applications. They get hacked pretty
frequently. Which I think is kind of sucky. And, weirdly, we still haven't fixed that problem.

WebAuthn aims to solve the problem of hacked passwords by taking the password exchange out of the picture. Instead of
submitting a password, we're using public key cryptography.

It works like this:

1. You ask the server to register a new account.
2. The server sends you a registration challenge that you must complete.
3. To complete the registration challenge, your browser creates a public and private key pair.
   It then uses the private key to sign the challenge. After signing the challenge, the public key, and the challenge
   are returned to the server.
4. The server verifies it's you by checking the signature with the public key. It also confirms that you and not someone
   else completed the challenge by confirming other things like the randomly generated credential ID.

The server uses [a 26-step verification process][REGISTRATION_PROCESS] that I'm not going to highlight here. These
steps are necessary to ensure that the registration process happens correctly and safely.

Once you're registered, you can log in using your key pair, which works as follows:

1. You ask the server for a login challenge that you can complete using the registered public key.
2. Your browser retrieves the key pair associated with the login challenge and signs the challenge using the private key.
   It sends the signed challenge to the server to log in.
3. The server verifies that the challenge was correctly signed using the public key.
   If it's valid, you're logged in just like you would be with a user name and password.

As you can probably imagine, this process is, in reality, a lot more complex. I've highlighted the core here. For
a complete overview, I recommend you [read the spec][AUTHENTICATION_PROCESS]

Note that we're exchanging one-half of the key pair. We can do this because the public key is useless without the
private key. You need the private key to sign data, and you also need it for decrypting messages. We never share the
private key with anyone. That keeps things safe.

The big question here is: How do we obtain a key pair?

- Your motherboard, specifically, the trusted platform module (TPM)
- Your mobile phone
- A FIDO2 Key

In this post and the demo, I will only cover how to use FIDO2 keys to authenticate users. You'll need a
slightly different configuration to use your mobile phone or the TPM.

FIDO2 is the Fast Identity Online standard version 2. It's implemented in two parts. The WebAuthn standard and
CTAP (Client to authenticator protocol). Where WebAuthn handles the authentication and registration steps
in the browser, CTAP handles communication between FIDO2 keys and the browser.

FIDO2 Keys are usually implemented as devices that you can connect to your computer using Bluetooth, USB, or NFC. The FIDO2
key is used to store the keypairs you need for accessing web applications.

## Implementing WebAuthn in ASP.NET Core

As a test case, I implemented WebAuthn in a small ASP.NET Core application. I used [the Fido2 library][FIDO2_LIB] to
implement the server-side components.

My experience with the Fido2 .NET package is mixed. The library is small and doesn't have much functionality
other than creating and verifying challenges for registering and authenticating users. It uses
[a callback pattern][CALLBACK_SAMPLE] to perform certain checks you need to implement yourself. This feels strange
and unnecessary. There are better ways to implement these checks.

The client-side experience with WebAuthn is a lot better. All popular browsers understand WebAuthn. I've only had to
write a [few short fragments][CREDENTIAL_SCRIPT] of code to get things going.

If you're interested in the code and the details of my ASP.NET Core experiment, I recommend [checking out the source
code on Github](https://github.com/wmeints/webauthn-sample).

## Using the Feitian ePass FIDO2 Key

There are a lot of suppliers that offer FIDO2 keys. Feitian is one of the many. It's a Chinese company that focuses on
building FIDO2 keys in all sorts of form factors ranging from NFC to Lightning connector-based ones that work with
your iPhone.

As I mentioned earlier, I got one for free to try out. I received the ePass FIDO2 key. As of the date of writing, Feitian
changed the catalog quite a bit. [The K39](https://www.ftsafe.com/Products/FIDO/Single_Button_FIDO) is the closest to
the one I received.

So how does the FIDO2 key work in combination with WebAuthn? There are two spots where the key is essential.
After you receive the registration challenge from the server, you can ask the browser to create a key pair to complete
the challenge.

The browser will ask you to insert the FIDO2 key into your computer. The browser then asks you to press the button on top of the key. Once you've
The browser will complete the registration challenge by inserting the key into a USB port and touching it.

Later, when you want to log in, you need the key again. After you receive the login challenge, the browser
will ask you to insert the key again and touch it. After inserting the key and touching it, the browser completes
the login challenge, and you'll be logged in.

It's relatively simple, insert the key and touch it. The key doesn't do much more for you. So what makes an excellent FIDO2 key, then?
I think we can assume that all FIDO2 keys have this functionality.

### About the ePass FIDO2 Key

I have a FIDO2 key from Yubico that I've used for ages. So the key I received wasn't a completely new experience
to me. I was more interested in how robust the key would be.

My FIDO2 Keys go with me everywhere. They get wet. I bump into things with them. I don't think I ever bend one out of
shape. But I guess that will happen at some point. A robust key is essential.

The ePass FIDO2 key comes in a solid aluminum housing with a black plastic middle. It felt robust and wasn't
hard to put on my keyring. I think Feitian spent quite a bit of time designing and testing it. The USB connector is integrated
tightly; there's absolutely no movement whatsoever.

The overall package is tiny, which is ideal since I carry it in my jeans pocket. The small form factor is essential to me. I'm in a wheelchair, and I already have a hard time reaching for my keys. Any large object on the
keyring will get in the way. Luckily, that's not the case with the Feitian ePass FIDO2 key.

I'm using my FIDO2 keys for a bunch of things:

- As a second factor for multiple online accounts such as Github, Google, Twitter, and others.
- For Logging in on remote servers through SSH

Here's an exciting post when you're interested in using FIDO2 keys for this purpose:

- [Using FIDO2 keys with SSH](https://www.stavros.io/posts/u2f-fido2-with-ssh/)

Overall I like the Feitian key a lot. It's small, sturdy, and just works. Do I like it more than the Yubico one I've used for the past few years? I don't know. It's sort of the same. The housing is nicer, though, and feels more solid.

Now that you've got a bit of an idea of what the Feitian ePass FIDO2 key feels like let's discuss Feitian.

### About Feitian

The company that sent me the FIDO2 key is Feitian. It's based in Beijing, China. They're pretty unknown but not small
by any measure. They've got over 1000 people working for them. And they're active in over 100 regions.

Regarding documentation, they're not very focused on providing much documentation. You're better
off browsing StackOverflow and the official specifications to learn how to use the FIDO2 key in your application.

However, I think that's not a big problem. The product works well, and you want a standard way of working for
easy integration into your website. I feel that any proprietary software would break the experience.

I have no data on what the support is like from Feitian. They sell through their own webshop, but most of their sales
will likely be through retail channels. You can return your key to the
local store if you have a problem.

### The price of the product

Given that documentation isn't a primary factor and support is the same as with competitor products, there are only two
factors that come into play for me when choosing a FIDO2 key:

- How solid is the product? Can it withstand abuse?
- What's the price of the product?

Here's the good news. The Feitian ePass FIDO2 key goes for around 20 euros for the basic version in Europe.
The NFC version goes for approximately 50 euros. The Yubico keys are a lot more expensive. So this product could be an
interesting contender.

## Conclusion

I had some fun building WebAuthn into a web application and testing out the Feitian ePass FIDO2 Keys. I
think FIDO2 and WebAuthn are good ways to log in without passwords. It would certainly make my life
easier. I hope that the support in .NET gets better, as the library I used wasn't very consistent in its naming
and had a weird callback pattern that I still don't fully grasp.

As for the FIDO2 key. It's an excellent key and does what it says on the box. I think I'm going to get myself another
one as a backup in case one of my keys breaks.

[FIDO2_LIB]: https://www.nuget.org/packages/Fido2
[CALLBACK_SAMPLE]: https://github.com/wmeints/webauthn-sample/blob/f6b8e148e9a457a0d8e81e37b189f36eebf3b1dc/src/WebAuthnSample/Services/WebAuthnInteractionService.cs#L113
[REGISTRATION_PROCESS]: https://w3c.github.io/webauthn/#sctn-registering-a-new-credential
[AUTHENTICATION_PROCESS]: https://w3c.github.io/webauthn/#sctn-verifying-assertion
[CREDENTIAL_SCRIPT]: https://github.com/wmeints/webauthn-sample/blob/f6b8e148e9a457a0d8e81e37b189f36eebf3b1dc/src/WebAuthnSample/Client/registration/RegistrationForm.tsx#L49
