var compile = function (musexpr) {
    
	return CompileExpr(musexpr, 0);
    
};

var endTime = function (time, expr) {
	switch(expr.tag)
	{
		case "note":
			return time + expr.dur;
			
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
			return [{ tag: 'note', pitch: expr.pitch, start: startTime, dur: expr.dur }];
			
		case "seq":
			return CompileExpr(expr.left, startTime).concat(CompileExpr(expr.right, endTime(startTime, expr.left)));
			
		case "par":
			return CompileExpr(expr.left, startTime).concat(CompileExpr(expr.right, startTime));
	
	}

};

