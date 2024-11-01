<template><div>
<p><em>Assuming a new cross-platform desktop project</em></p>
<p><em><a href="https://github.com/devbitesau/quickshots/blob/main/makeitbob/MakeItBobGame.cs">Make It Bob - Source</a></em></p>
<h2>Assets</h2>
<p>This excercise will be using the <em>moon.png</em> asset from <a href="https://www.kenney.nl/assets/background-elements">Kenny Background Elements</a> - full credit to Kenny for the creation.</p>
<p>Load this into the content tool, remembering to build afterward.</p>
<p><img src="@/assets/monogame/quickshot/moon.png" alt="moon.png"></p>
<h2>Intro</h2>
<p>Just a nice simple bob action, handy for props or floaty things.</p>
<h2>Bobby</h2>
<p>Starting on the code, create some member properties on the Game1 class to store the texture and
three positions.</p>
<pre><code class="language-cs"><span class="hljs-comment">// Add variables to store our texture and positions </span>
<span class="hljs-comment">// (We&#x27;ll be drawing them three times)</span>
<span class="hljs-keyword">private</span> Texture2D _texture;
<span class="hljs-keyword">private</span> Vector2 _position1;
<span class="hljs-keyword">private</span> Vector2 _position2;
<span class="hljs-keyword">private</span> Vector2 _position3;
</code></pre>
<p>In the <code>LoadContent(){}</code> function, load <em>moon.png</em> into <code>_texture</code>.</p>
<pre><code class="language-cs">    <span class="hljs-comment">// Here we load the texture (moon.png) from the Content folder</span>
    _texture = Content.Load&lt;Texture2D&gt;(<span class="hljs-string">&quot;moon&quot;</span>);
</code></pre>
<p>Directly after this, we’ll set the initial positions of our moon friend. There are a number of different ways
to accomplish this, here we simply divide the screen width by 25%, 50% and 75% to spread three moons evenly
across the canvas. The height is 50% or the middle vertically.</p>
<pre><code class="language-csharp">    <span class="hljs-comment">// Nudge to the left (25% of the screen width)</span>
    _position1 = <span class="hljs-keyword">new</span> Vector2(_graphics.PreferredBackBufferWidth * <span class="hljs-number">.25</span>f, _graphics.PreferredBackBufferHeight / <span class="hljs-number">2.0f</span>);

    <span class="hljs-comment">// Center (50% of the screen width)</span>
    _position2 = <span class="hljs-keyword">new</span> Vector2(_graphics.PreferredBackBufferWidth * <span class="hljs-number">.50</span>f, _graphics.PreferredBackBufferHeight / <span class="hljs-number">2.0f</span>);

    <span class="hljs-comment">// Nudge to the right (75% of the screen width)</span>
    _position3 = <span class="hljs-keyword">new</span> Vector2(_graphics.PreferredBackBufferWidth * <span class="hljs-number">.75</span>f, _graphics.PreferredBackBufferHeight / <span class="hljs-number">2.0f</span>);
</code></pre>
<p>Going into the <code>Update()</code> method, we’ll modify each of these positions in a slightly different manner.</p>
<p>For this one, we’ll use a sine curve against the total game time - <em>not frame time</em> - to give us an offset. Applynig
this offset to the <code>Y</code> part of the position will make it bob up and down.</p>
<pre><code class="language-csharp">    <span class="hljs-comment">// Using a sine curve against the total game time results in a smooth transition</span>
    <span class="hljs-built_in">float</span> y1 = (<span class="hljs-built_in">float</span>)Math.Sin(gameTime.TotalGameTime.TotalSeconds);
    _position1.Y += y1;
</code></pre>
<p>A visual representation of the <code>Sin()</code> calculation can be visualised like in the below diagram.</p>
<p><img src="@/assets/monogame/quickshot/sintime.png" alt="Sin Over Time"></p>
<p>Straight after this, lets calculate the other two positions we’ll end up using.</p>
<pre><code class="language-csharp">    <span class="hljs-comment">// Experiment with different curves to see what they look like</span>
    <span class="hljs-built_in">float</span> y2 = (<span class="hljs-built_in">float</span>)Math.Cos(gameTime.TotalGameTime.TotalSeconds);
    _position2.Y += y2;

    <span class="hljs-comment">// Adjust the result / modify the game time to change the amplitude / speed</span>
    <span class="hljs-built_in">float</span> y3 = (<span class="hljs-built_in">float</span>)Math.Cos(gameTime.TotalGameTime.TotalSeconds*<span class="hljs-number">5.0f</span>)*<span class="hljs-number">5.0f</span>;
    _position3.Y += y3;
</code></pre>
<p>Home stretch, going down to the <code>Draw()</code> method we’ll finish up with getting the texture drawn to the canvas.</p>
<p>Always remember to <code>_spriteBatch().Begin()</code> and <code>_spriteBatch().End()</code>, placing any draws between these methods.</p>
<pre><code class="language-c#">_spriteBatch.Begin();
<span class="hljs-comment">// ... Draw Calls Here ...</span>
_spriteBatch.End();
</code></pre>
<p>In here, repeat the below <code>_spriteBatch.Draw()</code> 3 times, changing the position property each time (<code>_position1</code>, <code>_position2</code>, <code>_position3</code>).</p>
<p>We’ll also center the texture on the draw call to make it easier to observe.</p>
<pre><code class="language-c#">    <span class="hljs-comment">// Draw the texture at the set positions</span>
    <span class="hljs-comment">// Note here we are reusing the texture, in something more complex you&#x27;ll probably encapsulate this in a class</span>
    _spriteBatch.Draw(
        _texture,       
        _position1,     <span class="hljs-comment">// _position2, _position3</span>
        <span class="hljs-literal">null</span>,
        Color.White,
        <span class="hljs-number">0.0f</span>,
        <span class="hljs-keyword">new</span> Vector2(_texture.Width/<span class="hljs-number">2f</span>, _texture.Height/<span class="hljs-number">2f</span>), <span class="hljs-comment">// Center the sprite draw call</span>
        <span class="hljs-number">1.0f</span>,
        SpriteEffects.None,
        <span class="hljs-number">0.0f</span>);
</code></pre>
<p>All going well, we should have something like the below. Note that this is a most basic example, useful for perhaps
a moon prop in the background that doesn’t move.</p>
<p>An extension to this would be to save the offsets seperatly, keeping the original positions.
Doing so, an example use might be having a ghost bob as it moves towards a player.</p>

</div></template>