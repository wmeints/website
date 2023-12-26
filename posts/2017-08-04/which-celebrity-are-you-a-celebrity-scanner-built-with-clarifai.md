---
title: Which celebrity are you? A celebrity scanner built with Clarifai
category: Machine Learning
datePublished: '2017-08-04'
dateCreated: '2017-08-04'
---
<!--kg-card-begin: markdown--><p>When it comes to building solutions with AI you want to be smart. Don't just run in there and start using Tensorflow. There are many good solutions such as Clarifai out there that don't require a lot of work, but still produce superior results.</p>
<p>I learned that again and again when building various experiments for customers. One of the experiments I'm working on right now is a celebrity scanner. This is a fun demo that demonstrates the power of AI when it comes to recognizing faces in pictures.</p>
<p>The application allows you to take a picture with your webcam. It takes this picture and scans for similarities with famous celebrities.</p>
<p><img src="/content/images/2017/08/celebscan3000.png" alt="celebscan3000"></p>
<p>It's quite easy to make this app. In this post I will show you how.</p>
<h2 id="readymadeaiwithclarifai">Ready made AI with Clarifai</h2>
<p>The goal for the celebrity scanner 3000 is to demonstrate how much fun AI can be. We combine the app with a poster that explains how a computer thinks.</p>
<p>It turns out its a pretty complicated topic, especially since image recognition requires a lot of code and training time to get right.</p>
<p>If you want to build something like a face recognition model yourself you will have to be prepared to train the model for hundreds of hours. Also it requires a deep knowledge of how a neural network works.</p>
<p>Now I can imagine that you don't have the time for that. And frankly for most applications you don't need to spend a lot of time to apply AI effectively.</p>
<p>With a tool like Clarifai you have face recognition within minutes rather than hundreds of hours. Clarifai is an online service that provides various image related AI models. You can invoke these models to do various things like:</p>
<ul>
<li>Recognize objects</li>
<li>Tag photos</li>
<li>Describe what is on the photo</li>
</ul>
<p>The people over at Clarifai keep extending their service with models every week. It's quite amazing if you ask me.</p>
<p>For the celebrity scan 3000 I used <a href="git@github.com:wmeints/olympus.git">the celebrity model</a> that is currently in Beta.</p>
<p>To invoke the model I've written a small piece of Javascript code on my app:</p>
<pre><code>let app = new Clarifai.App({
    apiKey: 'some-api-key'
});

app.models.predict(modelIdentifier, {base64: pictureData}).then(function(response) {
    let data = response.outputs[0].data;
                let face = data 
                    &amp;&amp; data.regions 
                    &amp;&amp; data.regions[0].data 
                    &amp;&amp; data.regions[0].data.face;
                
    // Ah, we have a familiar face, let's grab the concepts
    if(face) {
        let possibleMatches = face.identity &amp;&amp; face.identity.concepts;
        let people = [];

        for(let i = 0; i &lt; Math.min(possibleMatches.length, 10); i++) {
            let person = possibleMatches[i];

            people.pushObject({ 
                name: person.name,
                score: person.value
            });
        }
        
        return people;
    }
    
    return [];
}
</code></pre>
<p>Clarifai has a great Javascript programming model in the shape of a NPM package that you can install using <code>npm i --save clarifai</code>. You can use this in your web project using browserify, webpack or some other method.</p>
<p>Clarifai is a very generic image processing API, so the response is somewhat klunky. You have to travel down a few properties to get to the meat, but once you're there you get some pretty interesting results.</p>
<h2 id="gettingthedataforthepicture">Getting the data for the picture</h2>
<p>One problem though, I don't want people to upload a picture to my app I want them to take a picture with the webcam. For this I needed to build another piece of logic.</p>
<p>HTML5 has the media API that allows you to work with sound and video. It is however quite hard to use and not supported in all browsers. But as usual in Javascript there's a trick for that.</p>
<p>Some friendly people over at pitchly made a neat NPM package called <code>pitchly-webcamjs</code> that makes access to the webcam really simple.</p>
<p>So I wrote the following piece of code to access the webcam and grab a picture:</p>
<pre><code>let webcam = window.webcam;
let videoElement = document.getElementById(&quot;my-picture&quot;);

webcam.init().then(function() {
    videoElement.src = webcam.videoStream;
    videoElement.play();
});

function captureImage() {
    let canvas = document.createElement(&quot;canvas&quot;);

    canvas.width = 640;
    canvas.height = 480;

    canvas.getContext(&quot;2d&quot;).drawImage(
        videoElement, 0,0, canvas.width, canvas.height);
        
    let imageData = canvas.toDataURL().replace(
        /^data:image\/(png|jpg);base64,/, '');
        
    return imageData;
}
</code></pre>
<p>The first few lines gain access to the video element to which I want to bind the live feed of the webcam.</p>
<p>To capture an image you need to execute the code within the <code>captureImage</code> function. This grabs the content of the video element and draws it on an invisible canvas.</p>
<p>The Clarifai API requires image data without the additional headers, so we strip them from the image that is generated through the hidden canvas element.</p>
<p>Combine the two elements, the clarifai API and the webcam integration and you have yourself a celebrity scanner.</p>
<h2 id="getthecode">Get the code</h2>
<p>Interested in the code? Go grab it on Github: <a href="https://github.com/infosupport/celebscan">https://github.com/infosupport/celebscan</a></p>
<!--kg-card-end: markdown-->
