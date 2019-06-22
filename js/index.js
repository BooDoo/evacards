let settings = {
  topText: `neon`,
  midText: `genesis`,
  botText: `evangelion`,
  epText: `EPISODE:12`,
  titleText:
`She said,"Don't make others suffer
for your personal hatred."`,
  titleStyle: `serif`, // sans
  titleAlign: 'left', // center, right, (or x value)
  aspectRatio: `standard` // wide
};

function config(settings) {

  // Read input fields:
  document.querySelectorAll('input,select,textarea').
  forEach(el=> {
    settings[el.id] = el.value || el.textContent; 
  });
  
  if (settings.aspectRatio == `wide`) {
    settings.canvasWidth = 1280;
    settings.canvasHeight = 720;
    settings.leftMargin = 115;
    settings.rightBoundary = 1150;
  } else {
    settings.canvasWidth = 900;
    settings.canvasHeight = 675;
    settings.leftMargin = 75;
    settings.rightBoundary = 815;
  }
  
  settings.smHeadSize = settings.canvasHeight * 0.184;
  settings.lgHeadSize = settings.canvasHeight * 0.308;
  settings.epSize = settings.canvasHeight * 0.095;
  settings.titleSize = settings.canvasHeight * 0.095;
  settings.maxWidth = settings.rightBoundary - settings.leftMargin;
  
  return settings;
}

function draw(config) {
  let can = document.getElementById('canvas'),
      ctx = can.getContext('2d');
  
  let topText = config.topText.toUpperCase(),
      midText = config.midText.toUpperCase(),
      botText = config.botText.toUpperCase(),
      epText = config.epText.toUpperCase(),
      titleText = config.titleText,
      titleStyle = config.titleStyle,
      titleAlign = config.titleAlign,
      leftMargin = config.leftMargin,
      rightBoundary = config.rightBoundary,
      smHeadSize = config.smHeadSize,
      lgHeadSize = config.lgHeadSize,
      epSize = config.epSize,
      titleSize = config.titleSize,
      // these all squash/condense the text horizontally
      topSquash = 0.62,
      midSquash = 0.62,
      botSquash = 0.57,
      epSquash = 0.76,
      titleSquash = 0.76;
  
  let addText = addFittedText.bind(null, ctx, config);

  // black background 
  // standard @ 900*675
  // wide @ 1280*720
  can.width = config.canvasWidth;
  can.height = config.canvasHeight;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, can.width, can.height);

  // Drawing white text with white stroke
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#FFFFFF";
  ctx.textBaseline = "top";
  // Top two lines
  ctx.font = `900 ${smHeadSize}px MySerif`;
  addText(topText, 50, topSquash);
  addText(midText, 150, midSquash);
  // Bigger third line
  ctx.font = `900 ${lgHeadSize}px MySerif`;
  addText(botText, 239, botSquash);

  // Change font for EPISODE: label
  ctx.font = `700 ${epSize}px MySans`;
  addText(epText, 430, epSquash);
  
  // Change font for Title
  titleStyle = titleStyles[titleStyle];
  ctx.font = `${titleStyle.weight} ${titleSize}px ${titleStyle.family}`;
  addText(titleText, 530, titleStyle.squash, titleAlign);
  stackBlurCanvasRGBA('canvas', 0, 0, 900, 675, 1);
}

let titleStyles = {
  sans: {
    weight: 800,
    family: `MySans`,
    squash: 0.8
  },
  serif: {
    weight: 600,
    family: `MySerif`,
    squash: 0.76
  }
}

function addFittedText(ctx, config, text, y, squash=1, align='left', maxWidth=740) {
  let x; 
  
  if (align == "right") {
    ctx.textAlign = "right";
    x = config.rightBoundary;
  }
  else if (align == "left") {
    ctx.textAlign = "left";
    x = config.leftMargin
  }
  else if (align == "center") {
    ctx.textAlign = "center";
    x = (config.rightBoundary+config.leftMargin) / 2;
  }
  else {x = align}
  
  let toDraw = text.split('\n');
  if (toDraw.length > 1) {
    ctx.textBaseline = "middle";
  }
  for (let n in toDraw) {
    let mWidth = ctx.measureText('M').width;
    // Use maximum available space (if set)
    // or squashed width by ratio
    let widthCalc = ctx.measureText(toDraw[n]).width;
    if (widthCalc * squash >= maxWidth) {
      widthCalc = maxWidth;
    } else {
      widthCalc = widthCalc * squash;
    }
    // we're not stroking text for now, weird artifacts.
    // ctx.strokeText(toDraw[n], x, y+(n*mWidth), widthCalc);
    ctx.fillText(toDraw[n], x, y+(n*mWidth), widthCalc);
  }

  // reset to "reasonable" defaults
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
}

draw(config(settings));
setTimeout(function() {
  return draw(config(settings));
}, 100);
