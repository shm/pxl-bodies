var graphic;

graphic = new Object;

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


graphic.doStuff = function(el) {
  this.create() ;
  this.update() ;
} ;


graphic.weightX = function(x) {
  return x / (graphic.w - 1);
}

graphic.weightY = function(y) {
  var hm = (graphic.h - 1) % 2 == 0? (graphic.h - 1)/2 : Math.floor((graphic.h - 1)/2) + 1;
  var wy = Math.abs(Math.abs(y - hm) - hm) / hm;
  return wy;
}


graphic.create = function() {

  graphic.pixelSize = graphic.pixelSize || 100 ;

  this.width = this.width || 700 ;
  this.height = this.width || 500 ;

  var numX = Math.floor(this.width / (2*this.pixelSize)) ;
  var numY = Math.floor(this.height / (this.pixelSize)) ;




  this.numX = numX ;
  this.numY = numY ;

  this.w = 7 ;
  this.h = 7 ;

  this.bg = getRandomColor() ;
  this.fg = getRandomColor() ;


  this.svg = d3.select("#main")
  .append("svg")
  .attr('width', this.width )
  .attr('height', this.height ) ;

  g = this.svg.append("g");

  var mum = Math.floor( this.width / this.pixelSize ) ;


  for( var x = 0; x < mum*this.numY; x++ ) {

    var i = Math.floor(x%mum) ;
    var j = Math.floor(x/(mum)) ;

    graphic.svg
    .append("rect")
    .attr("width", this.pixelSize)
    .attr("height", this.pixelSize)
    .attr('x', i*this.pixelSize)
    .attr('y', j*this.pixelSize )
    .attr('id', 'r'+i+"_"+j)
    .attr("fill", 'white' ) ;
  }

}

graphic.regenFill = true ;

d3.select("#save").on("click", function(){
  var html = d3.select("svg")
  .attr("version", 1.1)
  .attr("xmlns", "http://www.w3.org/2000/svg")
  .node().parentNode.innerHTML;

  d3.select('canvas')
  .attr('width', graphic.width )
  .attr('height', graphic.height )
  .attr('style', 'display:none;') ;


  var canvas = new fabric.Canvas('c');


  fabric.loadSVGFromString(html, function (objects, options) {
    var loadedObject = fabric.util.groupSVGElements(objects, options);
    canvas.add(loadedObject);

    if (!fabric.Canvas.supports('toDataURL')) {
      alert('This browser doesn\'t provide means to serialize canvas to an image');
    } else {
      var a = document.createElement('a') ;
      a.download = "sample.png" ;
      a.href = canvas.toDataURL('png') ;
      a.click() ;

    }
  });


});

graphic.update = function() {

  if( graphic.regenFill ) {
    this.bg = getRandomColor() ;
    this.fg = getRandomColor() ;
  }

  var noise = new Noise(Math.random());

  var num = this.numX ;
  var num2 = this.numY;

  for( var x = 0; x < num*num2*2; x++ ) {
    var i = Math.floor(x%num) ;
    var j = Math.floor(x/(num2)) ;

    var n = (noise.simplex2(i, j) +1)/2 ;

    var fill = (this.weightX(i) * this.weightY(j)) + n > 0.75 ? this.fg :this.bg;

    graphic.svg.selectAll('#r'+i+"_"+j).attr('fill', fill) ;
    graphic.svg.selectAll('#r'+((num*2)-(i+1))+"_"+j).attr('fill', fill) ;

  }

};

graphic.destroy = function() {
  graphic.svg.remove();
  return delete graphic.svg;
};

document.addEventListener('keyup', function(e) {
  if(e.keyCode == 32){
    graphic.update() ;
    return ;
  }

  if(e.keyCode === 187 ) {
    graphic.pixelSize += 10 ;
  }

  if(e.keyCode === 189 ) {
    graphic.pixelSize -= 10 ;

  }

  graphic.destroy() ;
  graphic.create() ;
  graphic.update() ;

});


d3.select('#pixelSize').on('change', function(e) {
  graphic.pixelSize = document.getElementById('pixelSize').value ;
  graphic.destroy() ;
  graphic.create() ;
  graphic.update() ;
  console.log(""+graphic.pixelSize + "px") ;
  document.getElementById('pxl-lbl').innerHTML = ""+graphic.pixelSize + "px" ;
});
