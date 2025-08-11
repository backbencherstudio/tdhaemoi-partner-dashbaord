import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeetFirstInventoryData {
    kategorie: string;
    marke: string;
    modell: string;
    grosse: string;
    image?: string;
}

interface FeetFirstInventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FeetFirstInventoryData) => void;
}

// Mock data - in real app this would come from API
const categories = [
    { id: 'alltagsschuhe', name: 'Alltagsschuhe', icon: '👟' },
    { id: 'sportschuhe', name: 'Sportschuhe', icon: '🏃' },
    { id: 'arbeitsschuhe', name: 'Arbeitsschuhe', icon: '🥾' }
];

const brands: { [key: string]: string[] } = {
    'alltagsschuhe': ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse'],
    'sportschuhe': ['Nike', 'Adidas', 'Puma', 'Asics', 'Under Armour'],
    'arbeitsschuhe': ['Caterpillar', 'Timberland', 'Dr. Martens', 'Red Wing'],
    'stiefel': ['Timberland', 'Dr. Martens', 'UGG', 'Hunter'],
    'sandalen': ['Birkenstock', 'Crocs', 'Teva', 'Adidas']
};

const models: { [key: string]: { [key: string]: Array<{ name: string; image: string }> } } = {
    'alltagsschuhe': {
        'Nike': [
            { name: 'Air Max 90', image: '/images/products/shoes.png' },
            { name: 'Air Force 1', image: '/images/products/shoes.png' },
            { name: 'Revolution 6', image: '/images/products/shoes.png' }
        ],
        'Adidas': [
            { name: 'Stan Smith', image: '/images/products/shoes.png' },
            { name: 'Gazelle', image: '/images/products/shoes.png' },
            { name: 'Superstar', image: '/images/products/shoes.png' }
        ]
    },
    'sportschuhe': {
        'Nike': [
            { name: 'Air Zoom Pegasus', image: '/images/products/shoes.png' },
            { name: 'React Infinity', image: '/images/products/shoes.png' }
        ],
        'Adidas': [
            { name: 'Ultraboost 22', image: '/images/products/shoes.png' },
            { name: 'Alphabounce', image: '/images/products/shoes.png' }
        ]
    }
    // Add more categories and models as needed
};

const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];

export default function FeetFirstInventoryModal({ isOpen, onClose, onSave }: FeetFirstInventoryModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedData, setSelectedData] = useState<FeetFirstInventoryData>({
        kategorie: '',
        marke: '',
        modell: '',
        grosse: '',
        image: ''
    });

    const handleCategorySelect = (category: { id: string; name: string; icon: string }) => {
        setSelectedData({
            kategorie: category.name,
            marke: '',
            modell: '',
            grosse: '',
            image: ''
        });
        setCurrentStep(2);
    };

    const handleBrandSelect = (brand: string) => {
        setSelectedData(prev => ({
            ...prev,
            marke: brand,
            modell: '',
            grosse: ''
        }));
        setCurrentStep(3);
    };

    const handleModelSelect = (model: { name: string; image: string }) => {
        setSelectedData(prev => ({
            ...prev,
            modell: model.name,
            image: model.image
        }));
        setCurrentStep(4);
    };

    const handleSizeSelect = (size: string) => {
        setSelectedData(prev => ({
            ...prev,
            grosse: size
        }));
    };

    const handleConfirmSelection = () => {
        onSave(selectedData);
        onClose();
        // Reset for next time
        setCurrentStep(1);
        setSelectedData({
            kategorie: '',
            marke: '',
            modell: '',
            grosse: '',
            image: ''
        });
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleModalClose = () => {
        onClose();
        // Reset for next time
        setCurrentStep(1);
        setSelectedData({
            kategorie: '',
            marke: '',
            modell: '',
            grosse: '',
            image: ''
        });
    };

    const getAvailableBrands = () => {
        const categoryKey = categories.find(cat => cat.name === selectedData.kategorie)?.id || '';
        return brands[categoryKey] || [];
    };

    const getAvailableModels = () => {
        const categoryKey = categories.find(cat => cat.name === selectedData.kategorie)?.id || '';
        return models[categoryKey]?.[selectedData.marke] || [];
    };

    const isConfirmDisabled = !selectedData.kategorie || !selectedData.marke || !selectedData.modell || !selectedData.grosse;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Aus FeetFirst-Bestand wählen
                            </h2>
                            <p className="text-sm text-gray-500">Schritt {currentStep} von 4</p>
                        </div>
                    </div>
                    <button
                        onClick={handleModalClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 bg-gray-50 flex justify-center">
                    <div className="w-full max-w-md">
                        <div className="flex items-center w-full">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {step}
                                </div>
                                {step < 4 && (
                                    <div className={`flex-1 h-1 mx-2 ${
                                        step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center w-full mt-2">
                        {['Kategorie', 'Marke', 'Modell', 'Größe'].map((label, index) => (
                            <div key={index} className="flex items-center flex-1">
                                <div className="w-8 flex justify-center">
                                    <span className="text-xs text-gray-500">{label}</span>
                                </div>
                                {index < 3 && (
                                    <div className="flex-1" />
                                )}
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    {/* Step 1: Category Selection */}
                    {currentStep === 1 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Kategorie wählen</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category)}
                                        className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                                    >
                                        <span className="text-3xl mb-2">{category.icon}</span>
                                        <span className="text-sm font-medium text-center">{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Brand Selection */}
                    {currentStep === 2 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Marke wählen</h3>
                            <p className="text-sm text-gray-600 mb-4">Kategorie: {selectedData.kategorie}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {getAvailableBrands().map((brand) => (
                                    <button
                                        key={brand}
                                        onClick={() => handleBrandSelect(brand)}
                                        className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center font-medium"
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Model Selection */}
                    {currentStep === 3 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Modell wählen</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                {selectedData.kategorie} → {selectedData.marke}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {getAvailableModels().map((model, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleModelSelect(model)}
                                        className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                                    >
                                        <img
                                            src={model.image}
                                            alt={model.name}
                                            className="w-16 h-16 object-cover rounded-md mr-4"
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/products/shoes.png';
                                            }}
                                        />
                                        <span className="font-medium">{model.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Size Selection */}
                    {currentStep === 4 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Größe wählen</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                {selectedData.kategorie} → {selectedData.marke} → {selectedData.modell}
                            </p>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeSelect(size)}
                                        className={`p-3 border rounded-lg text-center font-medium transition-colors ${
                                            selectedData.grosse === size
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            {selectedData.kategorie && (
                                <span>Ausgewählt: {selectedData.kategorie}
                                    {selectedData.marke && ` → ${selectedData.marke}`}
                                    {selectedData.modell && ` → ${selectedData.modell}`}
                                    {selectedData.grosse && ` → Größe ${selectedData.grosse}`}
                                </span>
                            )}
                        </div>
                        {currentStep === 4 && (
                            <button
                                onClick={handleConfirmSelection}
                                disabled={isConfirmDisabled}
                                className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                                    isConfirmDisabled
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-black hover:bg-gray-800'
                                }`}
                            >
                                Auswahl bestätigen
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
