---
title: >-
  The Art of AI Implementation: Strategic Steps for Building Effective LLM
  Applications
category: Machine Learning
datePublished: '2023-06-09'
dateCreated: '2023-06-09'
---
We’ve seen a lot of demonstrations lately with large language models. Everyone is racing to get on board with ChatGPT and other large language models (LLMs). I’ve never seen so many experts pop up in such a short time. 

But is there a method to the madness? Are we doing the right thing by staying away from the hype or should we go all in? It’s a question I get a lot this week. Here’s my answer.

## Building a demo is easy, building something real is hard.
Building a production-ready application with a large language model goes well beyond the simplicity of a demo though. It requires attention to MLOps, how to gather feedback, and AI safety. 

MLOps bridges the gap between development and deployment, with the right tools you can methodically improve the prompts you’re feeding into the model and possibly improve the model itself. You can also better control what’s running in production. 

Measuring feedback ensures you can apply continuous improvement based on user feedback. It’s often overlooked in demonstrations as it requires more than a good tool. To get the feedback you need, you’ll have to actively collect it from users with usability tests. In the past we’ve had a lot of success with ambassadors who would talk to users to collect much needed feedback on the products we built.

Safety mechanisms mitigate risks and ensure ethical use. By default, you get nothing. OpenAI doesn’t have a content filter. Microsoft has one, but you’re still going to have to take your own measures to ensure correct usage. 

In short, transitioning from a demo to a real application involves careful consideration of multiple factors to create a robust and reliable solution.

## AI starts with a business goal.
In the previous section we discussed reasons why building a good LLM application is hard. There’s another reason why building with LLMs is harder than you might think at first. You need a clear goal and vision for the use of artificial intelligence.

When implementing large language models (LLMs) or any AI technology, many organizations start without a clear goal. They start collecting data from production and expect to be successful. 
Simply using LLMs for chat purposes without a specific objective may not yield desired outcomes. Starting with a defined business goal and vision allows organizations to align their AI efforts with strategic objectives. 

When your organization has a clear goal, it helps you to identify the data requirements necessary to build effective AI applications and avoid using AI for the sake of using AI. By starting with a goal, you can approach AI implementation with purpose, allocate resources wisely, and maximize the potential of AI for your business.

## Implement using an experimental approach.

Still, even if you have a clear goal, there’s a lot of uncertainty around large language models. Large language model can do a lot of things. Whether those things are useful for your business remains a question until you start experimenting with LLMs. 

There are also many things that don’t work in LLMs. And you may not even realize that the model does the wrong thing. There’s still a lot of research going on to help us understand how large language models work.

At Aigency we use an experimental approach to build AI models. We strongly believe that all things we build can fail and will fail at first. However, by working methodically we work towards a working solution. It may not look like the original one, but we are sure you’re happier once we’re done.
Invest in small steps.

Using an experimental approach is your best bet towards a working solution. It also helps limit the investments and lower the risks for your organization. It’s not a good idea to invest in a couple of A100 GPUs when you don’t know whether that investment is warranted or if it will pay off.

The first question you should ask yourself:

1.	Are we in an area where LLMs are disruptive. Will it change the shape of our work?
2.	LLMs don’t have to be disruptive for you. But you could miss out on opportunities.
3.	Finally, for many organizations it’s more of an interesting concept.

We don’t know the exact effects of LLMs yet. But common wisdom tells us that the first option from the list is less likely for you. Marketing, Legal services, and other language-based jobs may experience more impact than other jobs. Despite what the media writes, we at Aigency believe that LLMs are not going to fully replace people.

Based on how much impact LLMs will likely have, you’re going to have to decide:

1.	When LLMs have a large impact on your work, you’re going to need to step in and go all out in using it. This means that you’re taking bigger risks, but the situation warrants that. We recommend experimenting and building your own solutions.
2.	When you miss out on opportunities without LLMs you’re going to have to experiment with it. But we recommend caution because the risks may not be worth it. Buying an off the shelf solution is probably the cheapest way to invest.
3.	Finally, when it’s more of an interesting concept to you we recommend holding off implementing LLMs at this point. One or two experiments may be enough to determine the value.

For Aigency, we know that our work is going to change. Our experiments with Github Copilot and ChatGPT have shown that we can save significantly on time spent coding up solutions. We’ve also seen that we can now spend more time being creative designing new AI models for our clients.

So, in a way, we’re somewhere between option 1 and 2. We choose to go all in, because it will teach us what LLMs can do for our clients. 

Whatever you choose, make sure that you work methodically with a clear goal in mind. Invest in small steps. Don’t worry about the time to market, small experiments are way faster than huge projects.

## Conclusion

I want you to leave with this: Don’t get distracted by the hype. It won’t last. What does last is a solid business goal, a good way of working, and sensible investments.

Have a great AI journey!
