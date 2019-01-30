const WIN_COLOR  = "00ff00"
const LOSE_COLOR = "ff0000"
const MID_COLOR  = "9EA07A"

const FULL_WIN_VAL = 0.8
const FULL_LOSE_VAL = 0.3
const MID_VAL = 0.5

// from https://gist.github.com/jedfoster/7939513
var mixColors = function(color_1, color_2, weight) {
  function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
  function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal 

  weight = (typeof(weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted

  var color = "#";

  for(var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
    var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
        v2 = h2d(color_2.substr(i, 2)),
        
        // combine the current pairs from each source color, according to the specified weight
        val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0))); 

    while(val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit
    
    color += val; // concatenate val to our new color string
  }
    
  return color; // PROFIT!
};

export const getColorForWinrate = (winrate) => {

	if (winrate == MID_VAL) {
		return '#' + MID_COLOR
	} else if (winrate >= FULL_WIN_VAL) {
		return '#' + WIN_COLOR
	} else if (winrate <= FULL_LOSE_VAL) {
		return '#' + LOSE_COLOR
	} 
	else if (winrate > MID_VAL)
	{
		var scaleFactor = 100 / (FULL_WIN_VAL - MID_VAL);
		var weight = scaleFactor * (winrate - MID_VAL);

		return mixColors(WIN_COLOR, MID_COLOR, weight) 
	}
	else if (winrate < MID_VAL)
	{
		var scaleFactor = 100 / (MID_VAL - FULL_LOSE_VAL);
		var weight = scaleFactor * (MID_VAL - winrate);

		return mixColors(LOSE_COLOR, MID_COLOR, weight) 
	} 
	else 
	{
		console.log('Unexpected winrate value - ' + winrate)
		return MID_COLOR;
	}

}