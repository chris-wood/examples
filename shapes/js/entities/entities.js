game.ShapeObject = me.Entity.extend({
     /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the super constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        this.hover = false;
        this.handler = me.event.subscribe("pointermove", this.mouseMove.bind(this));

        // to memorize where we grab the shape
        this.grabOffset = new me.Vector2d(0,0);
        
        //register on mouse/touch event
        me.input.registerPointerEvent('pointerdown', this, this.onSelect.bind(this));
        me.input.registerPointerEvent('pointerup', this, this.onRelease.bind(this));
    },

    /**
     * mousemove function
     */
    mouseMove: function (event) {
        this.hover = this.inViewport && 
                     // this is a globa; event, so first do 
                     // a basic rectangle detection to save some cycles
                     this.getBounds().containsPoint(
                        event.gameX, event.gameY
                     ) &&
                     // check the first shape
                     this.body.getShape(0).containsPoint(
                        // shape object position is relative to the entity
                        event.gameX - this.pos.x, event.gameY - this.pos.y
                     );

        if (this.canMove) {
            // follow the mouse/finger
            this.pos.set(event.gameX, event.gameY);
            this.pos.sub(this.grabOffset);
            // update the body bounds
            this.updateBounds();
        }
    },
    

    // mouse down function
    onSelect : function (event) {
        // the pointer event system will use the object bounding rect, check then with with the exact shape
        if (this.body.getShape(0).containsPoint(event.gameX - this.pos.x, event.gameY - this.pos.y)) {
            this.grabOffset.set(event.gameX, event.gameY);
            this.grabOffset.sub(this.pos);
            this.canMove = true;
            // don't propagate the event furthermore
            return false;
        }
        return true;
    },

    // mouse up function
    onRelease : function (event) {
        this.canMove = false;
        // don't propagate the event furthermore
        return false;
    },

    /**
     * update function
     */
    update: function () {
        return true;
    },
    
    /**
     * draw the square
     */
    draw: function (renderer) {
        renderer.setGlobalAlpha(this.hover ? 1.0 : 0.5);
        this._super(me.Entity, 'draw', [renderer]);
        renderer.setGlobalAlpha(1.0);
    }
});

game.Square = game.ShapeObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the super constructor
        this._super(game.ShapeObject, 'init', [x, y, settings]);

        // add a rectangular shape
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));

        // pienapple
        this.renderable = new me.Sprite(0, 0, me.loader.getImage("sprites"), 20, 24);
        this.renderable.offset.x = 93;
        this.renderable.offset.y = 151;
        this.renderable.scale(7.5);
    }
});

game.Circle = game.ShapeObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the super constructor
        this._super(game.ShapeObject, 'init', [x, y, settings]);

        // add an ellipse shape
        this.body.addShape(new me.Ellipse(this.width/2, this.height/2, this.width, this.height));

        // tomato
        this.renderable = new me.Sprite(0, 0, me.loader.getImage("sprites"), 20, 20);
        this.renderable.offset.x = 65;
        this.renderable.offset.y = 153;
        this.renderable.scale(7.5);
    }
});

game.Poly = game.ShapeObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the super constructor
        this._super(game.ShapeObject, 'init', [x, y, settings]);

        // add a polygone shape
        this.body.addShape(new me.Polygon(0, 0, [
            // draw a star
            new me.Vector2d(0, 0),
            new me.Vector2d(28, 60),
            new me.Vector2d(94, 70),
            new me.Vector2d(46, 114),
            new me.Vector2d(88, 180),
            new me.Vector2d(0, 125),
            new me.Vector2d(-88, 180),
            new me.Vector2d(-46, 114),
            new me.Vector2d(-94, 70),
            new me.Vector2d(-28, 60)
        ]));

        // star
        this.renderable = new me.Sprite(0, 0, me.loader.getImage("sprites"), 24, 24);
        this.renderable.offset.x = 86;
        this.renderable.offset.y = 241;
        this.renderable.scale(7.5);
    }
});
