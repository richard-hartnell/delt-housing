
const DELTflationSlider = document.getElementById('DELTflation');
const DELTflationValue = document.getElementById('DELTflationValue');
const dissolveLength = document.getElementById('dissolveLength');
const dissolveLengthValue = document.getElementById('dissolveLengthValue');
const mortgageLength = document.getElementById('mortgageLength');
const mortgageLengthValue = document.getElementById('mortgageLengthValue');
const homePrice = document.getElementById('homePrice');
const output1 = document.getElementById('output1');
const homePriceValue = document.getElementById('homePriceValue');
const housemates = document.getElementById('housemates');
const output2 = document.getElementById('output2');
const housematesValue = document.getElementById('housematesValue');
const year = document.getElementById('year');
const yearValue = document.getElementById('yearValue');
const firstMonthRentValue = document.getElementById('firstMonthRentValue');
const moveInYear = document.getElementById('moveInYear');
const moveOutYear = document.getElementById('moveOutYear');
const tenantStartYear = document.getElementById('tenantStartYear');
const tenantYears = document.getElementById('tenantYears');
const tenantStartRent = document.getElementById('tenantStartRent');
const tenantEndRent = document.getElementById('tenantEndRent');
const tenantRentAdjusted = document.getElementById('tenantRentAdjusted');
const adjustedVersusMR = document.getElementById('adjustedVersusMR');
const inflation = 1.03;
const MRflation = 1.072;
const debtIndexDELT = {};
const debtIndexMR = {};
let currentDissolveLength = parseInt(dissolveLength.value);

const simulateTenant = () => {
    let tenantRentPaidValue = 0;
    let tenantRentPaidMRValue = 0;
    let tenantEquityRepaidValue = 0;
    let adjustedVersusMRValue;
    const tenantMoveInYearValue = parseInt(moveInYear.value);
    const tenantMoveOutYearValue = parseInt(moveOutYear.value);
    tenantStartYear.textContent = tenantMoveInYearValue;
    tenantYears.textContent = tenantMoveOutYearValue - tenantMoveInYearValue;
    const ML = parseInt(mortgageLengthValue.textContent);
    const DL = parseInt(dissolveLengthValue.textContent);

    if (parseInt(moveOutYear.value) < parseInt(moveInYear.value)) {
        document.getElementById('moveOutMessage').textContent = "Silly! You can't move out before you move in.";
    } else {
        document.getElementById('moveOutMessage').textContent = ""; // Clear the message
    }

    for (i = tenantMoveInYearValue; i <= tenantMoveOutYearValue; i++) {
        tenantRentPaidValue += (DELTindex[i]);
        tenantRentPaidMRValue += (MRindex[i]);
    }

    for (i = tenantMoveInYearValue; i <= tenantMoveOutYearValue; i++) {
        if (i <= ML) {
            tenantEquityRepaidValue += (DELTindex[i] / 2);
        } else if (i <= (ML + DL)) {
            if ((i - ML) / DL >= 1) {
                
            } else {
            tenantEquityRepaidValue += ((DELTindex[i] / 2) * (1 - ((i - ML) / DL)));
            }
        }
    }

    adjustedVersusMRValue = tenantRentPaidValue / tenantRentPaidMRValue;
    tenantRentAdjustedValue = Math.round(tenantRentPaidValue - tenantEquityRepaidValue);
    tenantRentPaid.textContent = tenantRentPaidValue;
    tenantRentPaidMR.textContent = tenantRentPaidMRValue;
    tenantEquityRepaid.textContent = Math.round(tenantEquityRepaidValue);
    tenantRentAdjusted.textContent = tenantRentAdjustedValue;
    tenantRentAdjustedDeflated.textContent = Math.round(tenantRentAdjustedValue / Math.pow((1.03), parseInt(moveOutYear.value)));
    tenantRentMRAdjustedDeflated.textContent = Math.round(tenantRentPaidMRValue / Math.pow((1.03), parseInt(moveOutYear.value)));
    
    adjustedVersusMR.textContent = Math.round(100 - ((tenantRentAdjustedValue / tenantRentPaidMRValue) * 100).toFixed(1));
    tenantStartRent.textContent = Math.round((DELTindex[tenantMoveInYearValue] / MRindex[tenantMoveInYearValue]) * 100);
    tenantEndRent.textContent = Math.round((DELTindex[tenantMoveOutYearValue] / MRindex[tenantMoveOutYearValue]) * 100);
};

const updateDebtIndexDELT = () => {
    debtIndexDELT[0] = parseInt(homePrice.value * 1.7);
    const _mortgageLength = parseInt(mortgageLengthValue.textContent);
    const _dissolveLength = parseInt(dissolveLengthValue.textContent);
    const _housemates = housemates.value;
    for (let i = 1; i <= 200; i++) {
        if (i <= _mortgageLength) {
            debtIndexDELT[i] = debtIndexDELT[i-1] + ((DELTindex[i] / 2) * _housemates);
            debtIndexDELT[i] -= (DELTindex[i] / 2) * _housemates;
        } else if (i > _mortgageLength && i < (_mortgageLength + _dissolveLength)) {
            debtIndexDELT[i] = debtIndexDELT[i-1] + ((DELTindex[i] / 2) * (1 - ((i - _mortgageLength) / _dissolveLength)));
            debtIndexDELT[i] -= ((DELTindex[i] / 2) * _housemates);
            if (debtIndexDELT[i] < 0) {
                debtIndexDELT[i] = 0;
            }
        } else if (i >= (_mortgageLength + _dissolveLength)) {
            debtIndexDELT[i] = debtIndexDELT[i - 1] - ((DELTindex[i] / 2) * _housemates);
            if (debtIndexDELT[i] < 0) {
                debtIndexDELT[i] = 0;
            }
        }
    }
}

const updateDebtIndexMR = () => {
    const _mortgageLength = parseInt(mortgageLengthValue.textContent);
    const _dissolveLength = parseInt(dissolveLengthValue.textContent);
    debtIndexMR[0] = parseInt(homePrice.value * 1.7);
    for (let i = 1; i <= 100; i++) {
        debtIndexMR[i] = debtIndexMR[i-1] - ((MRindex[i] / 2) * housemates.value);
        if (debtIndexMR[i] <= 0) {
            debtIndexMR[i] = 0;
        }
    }
}

const MRindex = {};
const updateMRindex = () => {
    for (let i = 1; i <= 100; i++) {
        MRindex[i] = Math.round(firstMonthRentValue.textContent * (Math.pow(MRflation, i)));
    }
    document.getElementById('MRindex').textContent = MRindex[parseInt(yearValue.textContent)];
};

const INFindex = {};
const updateINFindex = () => {
    for (let i = 1; i <= 100; i++) {
        INFindex[i] = Math.round(firstMonthRentValue.textContent * (Math.pow(inflation, i)));
    }
};

updateINFindex();

const DELTindex = {};
const updateDELTindex = () => {
    updateINFindex();
    const _mortgageLength = parseInt(mortgageLengthValue.textContent);
    const _dissolveLength = parseInt(dissolveLengthValue.textContent);
    const _firstMonthRent = parseInt(firstMonthRentValue.textContent);
    const DELTflation = parseFloat(DELTflationSlider.value);
    const dInf = (inflation - DELTflation) / _dissolveLength;
    for (let i = 1; i <= 100; i++) {
        if (i <= _mortgageLength) {
            DELTindex[i] = Math.round(_firstMonthRent * Math.pow(DELTflation, i));
        } else if (i <= (_mortgageLength + _dissolveLength)) {
            DELTindex[i] = Math.round(DELTindex[i - 1] * inflation);
        } else {
            
            DELTindex[i] = Math.round(DELTindex[i-1] * inflation);
            if (DELTindex[i] > INFindex[i]) {
                DELTindex[i] -= (DELTindex[i] - INFindex[i]) * 0.05;
            }
        }
    }
    document.getElementById('DELTindex').textContent = DELTindex[parseInt(yearValue.textContent)];
};

const updateFirstMonthRent = () => {
    const priceAfterInterest = parseInt(homePrice.value) * 1.7; // todo: fix this?
    const mortgageLengthValue = parseInt(mortgageLength.value);
    const housemateSliderValue = parseInt(housemates.value);
    const firstMonthRent = Math.floor(priceAfterInterest * 2 / mortgageLengthValue / 12 / housemateSliderValue);
    firstMonthRentValue.textContent = firstMonthRent;
    updateDELTindex();
    updateMRindex();
    updateINFindex();
    updateDebtIndexDELT();
    updateDebtIndexMR();
    simulateTenant();
    drawPlot();
    secondPlot();
    updateYAxisLabels(firstMonthRent, MRindex[100]);
};

DELTflationSlider.addEventListener('input', () => {
    const value = parseFloat(DELTflationSlider.value).toFixed(3);
    DELTflationValue.textContent = value;
    updateFirstMonthRent();
});

dissolveLength.addEventListener('input', () => {
    const value = parseInt(dissolveLength.value);
    dissolveLengthValue.textContent = value;
    updateFirstMonthRent();
});

mortgageLength.addEventListener('input', () => {
    const value = parseInt(mortgageLength.value);
    mortgageLengthValue.textContent = value + ' years';
    updateFirstMonthRent();
    updateMortageLengthGraphLine(value);
});

homePrice.addEventListener('input', () => {
    const value = parseInt(homePrice.value);
    homePriceValue.textContent = '$' + value;
    updateFirstMonthRent();
});

housemates.addEventListener('input', () => {
    const value = parseInt(housemates.value);
    housematesValue.textContent = value;
    updateFirstMonthRent();
});

year.addEventListener('input', () => {
    const value = parseInt(year.value);
    yearValue.textContent = value;
    updateDELTindex();
    updateMRindex();
});

moveInYear.addEventListener('input', simulateTenant);
moveOutYear.addEventListener('input', simulateTenant);

function drawPlot() {
    const canvas = document.getElementById('rentCanvas');
    const ctx = canvas.getContext('2d');

    // Set up the range and scaling factors
    const minX = 1;
    const maxX = 75;
    firstMonthRent = parseInt(document.getElementById('firstMonthRentValue').textContent);
    // updateMRindex;
    const minY = firstMonthRent; // Start the Y-axis from firstMonthRent
    const maxY = 40000; // Change this to the maximum value of your data

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the X and Y axes
    ctx.beginPath();
    ctx.moveTo(60, canvas.height - 60);
    ctx.lineTo(canvas.width - 30, canvas.height - 60);
    ctx.moveTo(60, canvas.height - 60);
    ctx.lineTo(60, 30);
    ctx.strokeStyle = 'black'; //
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the vertical line at mortgageLengthValue
    const mortgageLengthValue = parseInt(document.getElementById('mortgageLength').value);
    const plotX = (mortgageLengthValue - minX) / (maxX - minX) * (canvas.width - 90) + 60;
    ctx.beginPath();
    ctx.moveTo(plotX, canvas.height - 60);
    ctx.lineTo(plotX, 30);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();

    // And the vert at mortgageLengthValue + dissolveLengthValue
    const dissolveLine = (mortgageLengthValue + dissolveLengthValue);
    ctx.beginPath();
    ctx.moveTo(dissolveLine, 30);
    ctx.lineTo(dissolveLine, canvas.height - 30);
    ctx.strokeStyle = 'purple'; //
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label the X and Y axes
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('X = Time (years)', canvas.width / 2, canvas.height - 40);
    ctx.save(); // Save the current context state
    ctx.translate(20, canvas.height / 2); // Translate to the Y axis label position
    ctx.rotate(-Math.PI / 2); // Rotate for Y axis label
    ctx.font = '16px Arial';
    ctx.fillText('Y = Rent ($)', 0, 0);
    ctx.restore(); // Restore the context state

    // Draw labels on the X axis without overlapping the axis title
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    for (let x = 5; x <= 100; x += 5) {
        const plotX = (x - minX) / (maxX - minX) * (canvas.width - 90) + 60;
        ctx.fillText(x, plotX, canvas.height - 10);
    }

    // Draw the MRindex plot
    ctx.beginPath();
    for (let x = minX; x <= maxX; x++) {
        const y = MRindex[x];
        const plotX = (x - minX) / (maxX - minX) * (canvas.width - 90) + 60;
        const plotY = canvas.height - ((y - minY) / (maxY - minY) * (canvas.height - 90) + 60);
        if (x === minX) {
            ctx.moveTo(plotX, plotY);
        } else {
            ctx.lineTo(plotX, plotY);
        }
    }
    ctx.strokeStyle = 'red'; // MRindex plot color
    ctx.lineWidth = 2; // Plot line width
    ctx.stroke();

    ctx.beginPath();
    for (let x = minX; x <= maxX; x++) {
        const y = INFindex[x]; // Remove the scaling factor
        const plotX = (x - minX) / (maxX - minX) * (canvas.width - 90) + 60;
        const plotY = canvas.height - ((y - minY) / (maxY - minY) * (canvas.height - 90) + 60);
        if (x === minX) {
            ctx.moveTo(plotX, plotY);
        } else {
            ctx.lineTo(plotX, plotY);
        }
    }
    ctx.strokeStyle = 'blue'; // MRindex plot color
    ctx.lineWidth = 2; // Plot line width
    ctx.stroke();

    // Draw the DELTindex plot
    ctx.beginPath();
    for (let x = minX; x <= maxX; x++) {
        const y = DELTindex[x];
        const plotX = (x - minX) / (maxX - minX) * (canvas.width - 90) + 60;
        const plotY = canvas.height - ((y - minY) / (maxY - minY) * (canvas.height - 90) + 60);
        if (x === minX) {
            ctx.moveTo(plotX, plotY);
        } else {
            ctx.lineTo(plotX, plotY);
        }
    }
    ctx.strokeStyle = 'green'; // DELTindex plot color
    ctx.lineWidth = 2; // Plot line width
    ctx.stroke();
    secondPlot();
}

function updateYAxisLabels(firstMonthRentValue, MRindex100) {
    const canvas = document.getElementById('rentCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 60, canvas.height);

    // Draw labels on the Y axis
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'right';
    ctx.fillText('$' + firstMonthRentValue, 55, canvas.height - 60);
    ctx.fillText('$' + MRindex100, 55, 30);
    drawPlot();
}

function updateMortageLengthGraphLine(mortgageLengthValue) {
    const canvas = document.getElementById('rentCanvas');
    const ctx = canvas.getContext('2d');

    // Clear the canvas area for the vertical line
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the vertical dotted line
    const minX = 1;
    const maxX = 100;

    const plotX = (mortgageLengthValue - minX) / (maxX - minX) * (canvas.width - 60) + 30;

    ctx.beginPath();
    ctx.moveTo(plotX, 30);
    ctx.lineTo(plotX, canvas.height - 30);
    ctx.lineWidth = 1;
    // ctx.setLineDash([4, 4]); // Dotted line

    // Redraw the graph
    drawPlot();
}

function secondPlot() {
  const canvas_two = document.getElementById('debtCanvas');
  const loan_ctx = canvas_two.getContext('2d');
  // Set up the range and scaling factors
  const minX = 1;
  const maxX = 100;
  const minY = 0; // Start the Y-axis from firstMonthRent
  const maxY = parseInt(homePrice.value * 1.7); // Change this to the maximum value of your data

  // Clear the canvas
  loan_ctx.clearRect(0, 0, canvas_two.width, canvas_two.height);

  // Draw the X and Y axes
  loan_ctx.beginPath();
  loan_ctx.moveTo(60, canvas_two.height - 60);
  loan_ctx.lineTo(canvas_two.width - 30, canvas_two.height - 60);
  loan_ctx.moveTo(60, canvas_two.height - 60);
  loan_ctx.lineTo(60, 30);
  loan_ctx.strokeStyle = 'black'; // Axis color
  loan_ctx.lineWidth = 2; // Axis line width
  loan_ctx.stroke();

  loan_ctx.font = '16px Arial';
    loan_ctx.fillStyle = 'black';
    loan_ctx.textAlign = 'center';
    loan_ctx.fillText('X = Time (years)', canvas_two.width / 2, canvas_two.height - 40);
    loan_ctx.save(); // Save the current context state
    loan_ctx.translate(20, canvas_two.height / 2); // Translate to the Y axis label position
    loan_ctx.rotate(-Math.PI / 2); // Rotate for Y axis label
    loan_ctx.font = '16px Arial';
    loan_ctx.fillText('Y = Debt ($)', 0, 0);
    loan_ctx.restore(); // Restore the context state

    // Draw labels on the Y axis
    const maxDebt = debtIndexDELT[0];
    loan_ctx.font = '12px Arial';
    loan_ctx.fillStyle = 'black';
    loan_ctx.textAlign = 'right';
    loan_ctx.fillText('$' + 0, 55, canvas_two.height - 65);
    loan_ctx.fillText('$' + maxDebt, 55, 45);

    // Draw labels on the X axis without overlapping the axis title
    loan_ctx.font = '12px Arial';
    loan_ctx.fillStyle = 'black';
    loan_ctx.textAlign = 'center';
    for (let x = 5; x <= 100; x += 5) {
        const plotX = (x - minX) / (maxX - minX) * (canvas_two.width - 90) + 60;
        loan_ctx.fillText(x, plotX, canvas_two.height - 10);
    }

    // Draw the DELT debt plot
    loan_ctx.beginPath();
    for (let x = minX; x <= maxX; x++) {
        const y = debtIndexDELT[x]
        const plotX = (x - minX) / (maxX - minX) * (canvas_two.width - 90) + 60;
        const plotY = canvas_two.height - ((y - minY) / (maxY - minY) * (canvas_two.height - 90) + 60);
        if (x === minX) {
            loan_ctx.moveTo(plotX, plotY);
        } else {
            loan_ctx.lineTo(plotX, plotY);
        }
    }
    loan_ctx.strokeStyle = 'red'; // MRindex plot color
    loan_ctx.lineWidth = 2; // Plot line width
    loan_ctx.stroke();

        // Draw the MR debt plot
        loan_ctx.beginPath();
        for (let x = minX; x <= maxX; x++) {
            const y = debtIndexMR[x]
            const plotX = (x - minX) / (maxX - minX) * (canvas_two.width - 90) + 60;
            const plotY = canvas_two.height - ((y - minY) / (maxY - minY) * (canvas_two.height - 90) + 60);
            if (x === minX) {
                loan_ctx.moveTo(plotX, plotY);
            } else {
                loan_ctx.lineTo(plotX, plotY);
            }
        }
        loan_ctx.strokeStyle = 'green'; // MRindex plot color
        loan_ctx.lineWidth = 2; // Plot line width
        loan_ctx.stroke();
    
}

// on page load
updateFirstMonthRent();
