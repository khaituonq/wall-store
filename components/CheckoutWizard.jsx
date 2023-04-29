import React from 'react';

const CheckoutWizard = ({ activeStep = 0 }) => {
    return (
        <div className="mb-5 flex -flex-wrap ">
            {['User Login', 'Shipping Address', 'Place Order'].map((step, index) => (
                <div
                    key={index}
                    className={`font-bold flex-1 border-b-2 text-center  ${
                        index <= activeStep ? 'border-indigo-700 text-indigo-700' : 'border-gray-700 text-gray-700'
                    }`}
                >
                    {step}
                </div>
            ))}
        </div>
    );
};

export default CheckoutWizard;
