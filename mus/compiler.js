var compile = function (musexpr) {
    
	return CompileExpr(musexpr, 0);
    
};

var endTime = function (time, expr) {
	switch(expr.tag)
	{
		case "note":
		case "rest":
			return time + expr.dur;
			
		case "repeat":
			return expr.dur * expr.count;
			
		case "seq":
			return endTime(endTime(time, expr.left), expr.right);
			
		case "par":
			return Math.max(endTime(time, expr.left), endTime(time, expr.right));
			
		default:
			return time;	
	
	}
};

var CompileExpr = function (expr, startTime) {
	
	switch(expr.tag)
	{
		case "note":
		case "rest":
			return [{ tag: 'note', pitch: convertPitch(expr.pitch), start: startTime, dur: expr.dur }];
			
		case "repeat":
			var result = [];
			for (var i = 0; i < expr.count; i++)
			{
				result.push(CompileExpr(expr.section, (endTime(0, expr.section) * i)));
			}
			return result;
			
		case "seq":
			return CompileExpr(expr.left, startTime).concat(CompileExpr(expr.right, endTime(startTime, expr.left)));
			
		case "par":
			return CompileExpr(expr.left, startTime).concat(CompileExpr(expr.right, startTime));
	
	}

};

var convertPitch = function (pitch) {
	var letterPitch = pitch[0];
	var octave = pitch[1];
	
	switch(letterPitch) 
	{
		case 'c': letterPitch = 0; break;
		case 'd': letterPitch = 2; break;
		case 'e': letterPitch = 4; break;
		case 'f': letterPitch = 5; break;
		case 'g': letterPitch = 7; break;
		case 'a': letterPitch = 9; break;
		case 'b': letterPitch = 11; break;
		default: letterPitch = 0;
	}
	
	return 12 + 12 * octave + letterPitch;

};

// simple tests for functionality
var melody_mus = {
  tag: 'seq',
  left: {
    tag: 'repeat', count: 2,
    section: {
      tag: 'seq',
      left: {
        tag: 'repeat', count: 2,
        section: {
          tag: 'note', pitch: 'a4', dur: 250
        }
      },
      right: { tag: 'note', pitch: 'b4', dur: 250 }
    }
  },
  right: {
    tag: 'seq',
    left: { tag: 'note', pitch: 'c4', dur: 500 },
    right: { tag: 'note', pitch: 'd4', dur: 500 }
  }
};

console.log(melody_mus);
console.log(compile(melody_mus));

