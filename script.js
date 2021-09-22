var SnowItem = /** @class */ (function () {
    function SnowItem(canvas, ctx, options) {
        var radius = options.radius, speed = options.speed, wind = options.wind, color = options.color;
        this.params = {
            color: color,
            x: _.random(0, canvas.offsetWidth),
            y: _.random(-canvas.offsetHeight, 0),
            radius: _.random.apply(_, radius),
            speed: _.random.apply(_, speed),
            wind: _.random.apply(_, wind),
            isResized: false
        };
        this.canvas = canvas;
        this.ctx = ctx;
    }
    SnowItem.prototype.updateData = function () {
        this.params.x = _.random(0, this.canvas.offsetWidth);
        this.params.y = _.random(-this.canvas.offsetHeight, 0);
    };
    SnowItem.prototype.translate = function () {
        this.params.y += this.params.speed;
        this.params.x += this.params.wind;
    };
    SnowItem.prototype.onDown = function () {
        if (this.params.y < this.canvas.offsetHeight)
            return;
        if (this.params.isResized) {
            this.updateData();
            this.params.isResized = false;
        }
        else {
            this.params.y = 0;
            this.params.x = _.random(0, this.canvas.offsetWidth);
        }
    };
    SnowItem.prototype.resized = function () {
        this.params.isResized = true;
    };
    SnowItem.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.arc(this.params.x, this.params.y, this.params.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.params.color;
        this.ctx.fill();
        this.ctx.closePath();
    };
    SnowItem.prototype.update = function () {
        this.translate();
        this.onDown();
    };
    return SnowItem;
}());
var Snow = /** @class */ (function () {
    function Snow(canvas, count, options) {
        if (options === void 0) { options = {}; }
        this.defaultOptions = {
            color: 'white',
            radius: [0.5, 3.0],
            speed: [1, 3],
            wind: [-0.5, 3.0]
        };
        this.countSnowFlakes = count;
        this.options = Object.assign({}, this.defaultOptions, options);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.snowFlakes = [];
        this.init();
        this.resize();
    }
    Snow.prototype.add = function (item) {
        this.snowFlakes.push(item);
    };
    Snow.prototype.update = function () {
        _.forEach(this.snowFlakes, function (el) { return el.update(); });
    };
    Snow.prototype.resize = function () {
        this.ctx.canvas.width = this.canvas.offsetWidth;
        this.ctx.canvas.height = this.canvas.offsetHeight;
        _.forEach(this.snowFlakes, function (el) { return el.resized(); });
    };
    Snow.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
        _.forEach(this.snowFlakes, function (el) { return el.draw(); });
    };
    Snow.prototype.events = function () {
        window.addEventListener('resize', this.resize.bind(this));
    };
    Snow.prototype.loop = function () {
        this.draw();
        this.update();
        window.requestAnimationFrame(this.loop.bind(this));
    };
    Snow.prototype.init = function () {
        var _this = this;
        _.times(this.countSnowFlakes, function () { return _this.add(new SnowItem(_this.canvas, _this.ctx, _this.options)); });
        this.events();
        this.loop();
    };
    return Snow;
}());
const canvas = document.getElementById('snow')
    
new Snow(canvas, 1000)