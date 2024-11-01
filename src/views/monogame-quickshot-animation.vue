<template><div>
<p><em>Assuming a new cross-platform desktop project</em></p>
<p><em><a href="https://github.com/devbitesau/quickshots/blob/main/animation/AnimationGame.cs">Animation - Source</a></em></p>
<h2>Assets</h2>
<p>This excercise will be using elements from <a href="https://pixelfrog-assets.itch.io/pixel-adventure-1">Pixel Adventure 1</a> - full credit to Pixel Frog for the creation.</p>
<p>Load these into the content tool, remembering to build afterward.</p>
<ul>
<li>Up : <img src="@/assets/monogame/quickshot/up.png" alt="up.png"></li>
<li>Down : <img src="@/assets/monogame/quickshot/down.png" alt="down.png"></li>
<li>Idle : <img src="@/assets/monogame/quickshot/idle.png" alt="idle.png"></li>
<li>Run : <img src="@/assets/monogame/quickshot/run.png" alt="run.png"></li>
</ul>
<h2>Intro</h2>
<p>There are many different ways to generate an animation in MonoGame, but one common method is a simple flip book style.</p>
<p>The general concept is that you swap out one texture for another once a certain amount of time (per animation frame)
elapses.</p>
<h2>One Image Per Frame</h2>
<p>For the first animation, we will simply toggle between two textures (seperate .png image files). Note that normally a
sprite animation stores multiple frames in a single image, but we’ll get to that soon enough.</p>
<p>In our game class, start by creating some private members. These will be used in the update and draw loops later.</p>
<pre><code class="language-csharp">    <span class="hljs-comment">// Stores original textures for the animation</span>
    <span class="hljs-keyword">private</span> List&lt;Texture2D&gt; _animIndividualFrames = <span class="hljs-keyword">new</span> List&lt;Texture2D&gt;();

    <span class="hljs-comment">// The current frame texture to draw</span>
    <span class="hljs-keyword">private</span> Texture2D _currentTexture;

    <span class="hljs-comment">// The animations world position</span>
    <span class="hljs-keyword">private</span> Vector2 _animationPosition;

    <span class="hljs-comment">// Variables to track the current frame and frame time</span>
    <span class="hljs-keyword">private</span> <span class="hljs-built_in">float</span> _frameCountdown;
    <span class="hljs-keyword">private</span> <span class="hljs-built_in">int</span> _currentFrame;
    <span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">float</span> SecondsPerFrame = <span class="hljs-number">.2</span>f;
</code></pre>
<p>In <code>LoadContent()</code> we’ll grab the screen width and height. Strictly not necessary but for this document makes positioning
the sprites easier.</p>
<pre><code class="language-csharp">        <span class="hljs-comment">// Grab the screen width to help with positioning</span>
        <span class="hljs-built_in">int</span> screenWidth = _graphics.PreferredBackBufferWidth;
        <span class="hljs-built_in">int</span> yPos = _graphics.PreferredBackBufferHeight / <span class="hljs-number">2</span>;
</code></pre>
<p>From here, load the Up and Down images into respective variables and add them to the animation frames list. Lists are in
the order we load them, so frame 1 would be ‘Down’ and so on.</p>
<pre><code class="language-csharp">        <span class="hljs-comment">// Read in our frame textures. We save them in a list, so a local variable is fine.</span>
        Texture2D frogDown = Content.Load&lt;Texture2D&gt;(<span class="hljs-string">&quot;Down&quot;</span>);
        Texture2D frogUp = Content.Load&lt;Texture2D&gt;(<span class="hljs-string">&quot;Up&quot;</span>);

        <span class="hljs-comment">// And add them to our frame list</span>
        _animIndividualFrames.Add(frogUp);
        _animIndividualFrames.Add(frogDown);
</code></pre>
<p>Set the initial position of the animation so that we can see it nicely on the screen. Note <code>* .25</code> here is effectively
1/4 th of the total screen width. Ie, <code>new Vector2(middle left x, center y)</code>.</p>
<pre><code class="language-csharp">        <span class="hljs-comment">// And give it a position</span>
        _animationPosition = <span class="hljs-keyword">new</span> Vector2((<span class="hljs-built_in">float</span>)(screenWidth * <span class="hljs-number">.25</span>), yPos);
</code></pre>
<p>The first frame of the animation needs to be set before we start updates and draws - If it’s not set an exception will
be thrown because it can’t load a null texture. This does not make a copy of the texture, just copies the reference to it.</p>
<p>Also set the current frame or index here.</p>
<pre><code class="language-csharp">        <span class="hljs-comment">// Then we need to set the first frame</span>
        _currentTexture = frogUp;
        _currentFrame = <span class="hljs-number">0</span>;
</code></pre>
<p>Create a method <code>FlipBookAnimationSeperateTextures</code> so that we can keep the update loop a bit cleaner. Use the code below,
taking note how we use the length of the animation frame list to work out when to cycle back to the first image. This way,
extending the image only requires adding new frames and not adjusting hard set frame counts.</p>
<pre><code class="language-csharp">    <span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title">FlipBookAnimationSeperateTextures</span>(<span class="hljs-params">GameTime gameTime</span>)</span>
    {
        <span class="hljs-comment">// Reduce the frame timer by the elapsed number of seconds.</span>
        _frameCountdown -= (<span class="hljs-built_in">float</span>)gameTime.ElapsedGameTime.TotalSeconds;

        <span class="hljs-comment">// If the timer is complete...</span>
        <span class="hljs-keyword">if</span> (_frameCountdown &lt;= <span class="hljs-number">0.0f</span>)
        {
            <span class="hljs-comment">// Reset the frame timer.</span>
            _frameCountdown = SecondsPerFrame;

            <span class="hljs-comment">// Increase the frame index, and roll back to the first (0) if we&#x27;ve reached the end.</span>
            _currentFrame++;
            <span class="hljs-keyword">if</span> (_currentFrame &gt; _animIndividualFrames.Count - <span class="hljs-number">1</span>) <span class="hljs-comment">// -1 is important, we check 0-&gt;n-1 instead of 1-&gt;n.</span>
            {
                _currentFrame = <span class="hljs-number">0</span>;
            }

            <span class="hljs-comment">// Set the current texture (frame) to the current frame index.</span>
            _currentTexture = _animIndividualFrames[_currentFrame];
        }
    }
</code></pre>
<p>Now going back to the update method of the game class, updating the animation timer and frames is as simple as calling
<code>FlipBookAnimationSeperateTextures(gameTime);</code></p>
<p>Jump over to the games <code>Draw()</code> method. Start a sprite batch, draw the <code>_currentTexture</code> and close the sprite batch’</p>
<pre><code class="language-csharp">        <span class="hljs-comment">// Always start a sprite batch with SpriteBatch.Begin()</span>
        _spriteBatch.Begin();

        <span class="hljs-comment">// Draw the current texture of the animation</span>
        _spriteBatch.Draw(_currentTexture, _animationPosition, Color.White);

        <span class="hljs-comment">// Always end a sprite batch with SpriteBatch.End()</span>
        _spriteBatch.End();
</code></pre>

</div></template>