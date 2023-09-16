document.getElementById('taxRegime').addEventListener('change', function()
    {
        var selectedOption = this.value;
        var contentOption1 = document.getElementById('content-old');
        var contentOption2 = document.getElementById('content-new');

            if (selectedOption === 'content-old')
            {
                contentOption1.style.display = 'block';
                contentOption2.style.display = 'none' ;
            }
            else if (selectOption === 'content-new')
            {
                contentOption1.style.display = 'none';
                contentOption2.style.display = 'block';

            }
        
            }
);

function calculateTax() {
    const income = parseFloat(document.getElementById('income').value);
    const taxRegime = document.getElementById('taxRegime').value;
    const cea = parseFloat(document.getElementById('cea').value);
    const cha = parseFloat(document.getElementById('cha').value);
    const section24 = parseFloat(document.getElementById('section24').value);
    const section80CCD1B = parseFloat(document.getElementById('section80CCD1B').value);
    const section80E = parseFloat(document.getElementById('section80E').value);
    const section80EE = parseFloat(document.getElementById('section80EE').value);
    const section80TTA = parseFloat(document.getElementById('section80TTA').value);
  
    if (isNaN(income) || isNaN(cea) || isNaN(cha)) {
        document.getElementById('result').textContent = 'Please enter valid income and allowances.';
        return;
    }

    // Common exemptions and deductions
    const standardDeduction = 50000; // Standard deduction
    const deductionUnderSection80C = 150000; // Deduction under Section 80C
    const deductionUnderSection80D = 25000; // Deduction under Section 80D
    const houseRentAllowance = 0.5 * income; // HRA exemption (assumed as 50% of income)

    let taxableIncome = income - standardDeduction;

    if (taxableIncome <= 0) {
        document.getElementById('result').textContent = 'No tax liability.';
        return;
    }

    // Define tax slabs and rates for the assessment year 2023-24
    let taxSlabs = [];

    if (taxRegime === 'old') {
        taxSlabs = [
            { min: 0, max: 250000, rate: 0 },
            { min: 250001, max: 500000, rate: 0.05 },
            { min: 500001, max: 1000000, rate: 0.2 },
            { min: 1000001, max: Infinity, rate: 0.3 }
        ];
    } else if (taxRegime === 'new') {
        // New tax regime with no deductions
        taxSlabs = [
            { min: 0, max: 250000, rate: 0 },
            { min: 250001, max: 500000, rate: 0.05 },
            { min: 500001, max: 750000, rate: 0.1 },
            { min: 750001, max: 1000000, rate: 0.15 },
            { min: 1000001, max: Infinity, rate: 0.2 }
        ];
    }

    let tax = 0;

    for (const slab of taxSlabs) {
        if (taxableIncome <= slab.max) {
            tax += (taxableIncome - slab.min) * slab.rate;
            break;
        } else {
            tax += (slab.max - slab.min) * slab.rate;
        }
    }

    // Deductions and exemptions (applicable in the old tax regime)
    if (taxRegime === 'old') {
        // Deductions under Section 80C and 80D
        tax -= Math.min(deductionUnderSection80C, taxableIncome);
        tax -= Math.min(deductionUnderSection80D, taxableIncome);

        // Exemption for HRA
        tax -= Math.min(houseRentAllowance, taxableIncome);

        // Exemption for Children Education Allowance (CEA) and Children Hostel Allowance (CHA)
        tax -= cea;
        tax -= cha;

        // Deduction under Section 24 for home loan interest (assumed)
        const homeLoanInterest = 200000; // Assumed deduction amount
        tax -= Math.min(homeLoanInterest, taxableIncome);

        // Deduction under Section 80CCD(1B) for National Pension Scheme (NPS)
        const deductionUnderSection80CCD1B = 50000; // Assumed deduction amount
        tax -= Math.min(deductionUnderSection80CCD1B, taxableIncome);

        // Deduction under Section 80E for education loan interest (assumed)
        const deductionUnderSection80E = 30000; // Assumed deduction amount
        tax -= Math.min(deductionUnderSection80E, taxableIncome);

        // Deduction under Section 80EE for home loan interest (assumed)
        const deductionUnderSection80EE = 10000; // Assumed deduction amount
        tax -= Math.min(deductionUnderSection80EE, taxableIncome);

        // Deduction under Section 80TTA for savings account interest (assumed)
        const deductionUnderSection80TTA = 5000; // Assumed deduction amount
        tax -= Math.min(deductionUnderSection80TTA, taxableIncome);
    }

    if (tax < 0) {
        tax = 0; // Ensure tax is not negative due to deductions
    }

    document.getElementById('result').textContent = `Your tax liability is INR ${tax.toFixed(2)}.`;
}
