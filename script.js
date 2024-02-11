// vars!
const debtGraph = document.getElementById('debt-graph');
const rentGraph = document.getElementById('rent-graph');
const DELTflationSlider = document.getElementById('DELTflation');
const DELTflationValue = document.getElementById('DELTflationValue');
const dissolveLength = document.getElementById('dissolveLength');
const dissolveLengthValue = document.getElementById('dissolveLengthValue');
const mortgageRate = document.getElementById('mortgageRate');
const mortgageRateValue = document.getElementById('mortgageRateValue');
const mortgageLength = document.getElementById('mortgageLength');
const mortgageLengthValue = document.getElementById('mortgageLengthValue');
const homePrice = document.getElementById('homePrice');
const homePriceValue = document.getElementById('homePriceValue');
const housemates = document.getElementById('housemates');
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
const tenantRentPaidMR = document.getElementById('tenantRentPaidMR');
const tenantRentPaidMR2 = document.getElementById('tenantRentPaidMR2');
const tenantRentPaid = document.getElementById('tenantRentPaid');
const tenantEquityRepaid = document.getElementById('tenantEquityRepaid');
const tenantRentAdjustedDeflated = document.getElementById('tenantRentAdjustedDeflated');
const tenantRentMRAdjustedDeflated = document.getElementById('tenantRentMRAdjustedDeflated');
let currentDissolveLength = parseInt(dissolveLength.value);

const simulateTenant = () => {
    let tenantRentPaidValue = 0;
    let tenantRentPaidMRValue = 0;
    let tenantEquityRepaidValue = 0;
    let adjustedVersusMRValue;
    const tenantMoveInYearValue = parseInt(moveInYear.value);
    const tenantMoveOutYearValue = tenantMoveInYearValue + parseInt(moveOutYear.value);
    tenantStartYear.textContent = tenantMoveInYearValue;
    tenantYears.textContent = tenantMoveOutYearValue - tenantMoveInYearValue;
    const ML = parseInt(mortgageLengthValue.textContent);
    const DL = parseInt(dissolveLengthValue.textContent);

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
    let tenantRentAdjustedValue = Math.round(tenantRentPaidValue - tenantEquityRepaidValue);
    tenantRentPaid.textContent = Math.round(tenantRentPaidValue);
    tenantRentPaidMR.textContent = tenantRentPaidMRValue;
    tenantRentPaidMR2.textContent = tenantRentPaidMRValue;
    tenantEquityRepaid.textContent = Math.round(tenantEquityRepaidValue);
    tenantRentAdjusted.textContent = tenantRentAdjustedValue;
    tenantRentAdjustedDeflated.textContent = Math.round(tenantRentAdjustedValue / Math.pow((1.03), parseInt(tenantMoveOutYearValue - 1)));
    tenantRentMRAdjustedDeflated.textContent = Math.round(tenantRentPaidMRValue / Math.pow((1.03), parseInt(tenantMoveOutYearValue - 1)));
    adjustedVersusMR.textContent = Math.round(100 - ((tenantRentAdjustedValue / tenantRentPaidMRValue) * 100).toFixed(1));
    tenantStartRent.textContent = Math.round((DELTindex[tenantMoveInYearValue] / MRindex[tenantMoveInYearValue]) * 100);
    tenantEndRent.textContent = Math.round((DELTindex[tenantMoveOutYearValue] / MRindex[tenantMoveOutYearValue]) * 100);
};

const updateDebtIndexMR = () => {
    let _mortgageValue = parseInt(homePrice.value);
    const _mortgageLength = parseInt(mortgageLengthValue.textContent);
    const _dissolveLength = parseInt(dissolveLengthValue.textContent);
    debtIndexMR[0] = parseInt(homePrice.value);
    for (let i = 1; i <= 100; i++) {
        debtIndexMR[i] = debtIndexMR[i-1] - ((MRindex[i] / 2) * housemates.value * 12);
        if (debtIndexMR[i] <= 0) {
            debtIndexMR[i] = 0;
        }
        debtIndexMR[i] *= 1.05;
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
    const _mortgageRate = parseFloat(mortgageRate.value);
    const _mortgageLength = parseInt(mortgageLengthValue.textContent);
    const _dissolveLength = parseInt(dissolveLengthValue.textContent);
    const _firstMonthRent = parseInt(firstMonthRentValue.textContent);
    const DELTflation = parseFloat(DELTflationSlider.value);
        for (let i = 1; i <= 100; i++) {
        if (i <= _mortgageLength) {
            DELTindex[i] = Math.round(_firstMonthRent * Math.pow(DELTflation, i));
        } else {
            DELTindex[i] = Math.round(DELTindex[i-1] * inflation);
            if (DELTindex[i] > INFindex[i]) {
                DELTindex[i] -= (DELTindex[i] - INFindex[i]) * 0.05;
            }
        }
    }
    document.getElementById('DELTindex').textContent = DELTindex[parseInt(yearValue.textContent)];
};

const updateDebtIndexDELT = () => {
    debtIndexDELT[0] = parseInt(homePrice.value);
    let _mortgageDebt = parseInt(homePrice.value);
    let _tenantDebt = 0;
    const _mortgageLength = parseInt(mortgageLengthValue.textContent);
    const _dissolveLength = parseInt(dissolveLengthValue.textContent);
    const _housemates = housemates.value;
    for (let i = 1; i <= 100; i++) {
        let _dF = (1 - ((i - _mortgageLength) / _dissolveLength));
        if (_dF < 0) {
            _dF = 0;
        };
        if (_mortgageDebt == 0) {
                _tenantDebt += (DELTindex[i] / 2) * _housemates * 12 * (_dF);
            _tenantDebt -= (DELTindex[i] / 2) * _housemates * 12;
            debtIndexDELT[i] = _tenantDebt;
        }
        else if (_mortgageDebt <= (DELTindex[i] / 2) * _housemates * 12) {
            _tenantDebt += (_mortgageDebt);
            debtIndexDELT[i] = _tenantDebt;
            _mortgageDebt = 0;
        }
        else if (_mortgageDebt > (DELTindex[i] / 2) * _housemates * 12) {
            _mortgageDebt -= (DELTindex[i] / 2) * _housemates * 12;
            _tenantDebt += (DELTindex[i] / 2) * _housemates * 12;
            debtIndexDELT[i] = _mortgageDebt + _tenantDebt;
            _mortgageDebt *= 1.05;
        } 
        if (debtIndexDELT[i] <= 0) {
            debtIndexDELT[i] = 0;
        }
    }
}

const updateFirstMonthRent = () => {
    const initialPrice = parseInt(homePrice.value);
    const _mortgageLength = parseInt(mortgageLength.value);
    const _housemates = parseInt(housemates.value);
    const firstMonthRent = Math.floor(initialPrice * 2 / _mortgageLength / 12 / _housemates);
    firstMonthRentValue.textContent = firstMonthRent;
    updateDELTindex();
    updateMRindex();
    updateINFindex();
    updateDebtIndexDELT();
    updateDebtIndexMR();
    simulateTenant();
    drawPlot();
    secondPlot();
};

debtGraph.addEventListener('click', () => {
    if (debtGraph.src.match('debt-graph-1.webp')) {
        debtGraph.src='debt-graph-2.webp';
    } else if (debtGraph.src.match('debt-graph-2.webp')) {
        debtGraph.src='debt-graph-3.webp';
    } else if (debtGraph.src.match('debt-graph-3.webp')) {
        debtGraph.src='debt-graph-4.webp';
    }
});

rentGraph.addEventListener('click', () => {
    if (rentGraph.src.match('rent-graph-1.webp')) {
        rentGraph.src='rent-graph-2.webp'
    } else if (rentGraph.src.match('rent-graph-2.webp')) {
        rentGraph.src='rent-graph-3.webp'
    }
});

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
    const maxX = 50;
    firstMonthRent = parseInt(document.getElementById('firstMonthRentValue').textContent);

    // updateMRindex;
    const minY = firstMonthRent;
    const maxY = 10000;

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
    ctx.strokeStyle = 'brown'; // MRindex plot color
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

    // Redraw the graph
    drawPlot();
}

function secondPlot() {
  const canvas_two = document.getElementById('debtCanvas');
  const loan_ctx = canvas_two.getContext('2d');
  // Set up the range and scaling factors
  const minX = 1;
  const maxX = 50;
  const minY = 0; // Start the Y-axis from firstMonthRent
  const maxY = parseInt(homePrice.value) * 1.8; // Change this to the maximum value of your data

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
    loan_ctx.strokeStyle = 'green';
    loan_ctx.lineWidth = 2;
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
    loan_ctx.strokeStyle = 'brown';
    loan_ctx.lineWidth = 2;
    loan_ctx.stroke();
}

updateFirstMonthRent();