import breedsData from '../data/breeds.json';

export interface BreedData {
  description: string;
  purpose: string;
  milk_yield: string;
  region: string;
  physical_traits: string;
  management_tips: string;
}

export interface IdentificationResult {
  breedName: string;
  description: string;
  purpose: string;
  milkYield: string;
  region: string;
  physicalTraits: string;
  managementTips: string;
  confidence: number;
}

// Simulated AI model prediction - In production, this would call your trained model
const predictBreed = async (imageFile: File): Promise<{ breedName: string; confidence: number }> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, randomly select a breed with confidence
  // In production, this would be replaced with actual model inference
  const breedNames = Object.keys(breedsData);
  const randomBreed = breedNames[Math.floor(Math.random() * breedNames.length)];
  const confidence = Math.random() * 0.3 + 0.7; // Random confidence between 70-100%
  
  return {
    breedName: randomBreed,
    confidence: confidence
  };
};

export const identifyBreed = async (imageFile: File): Promise<IdentificationResult> => {
  try {
    // Get prediction from model
    const prediction = await predictBreed(imageFile);
    
    // Find breed data
    const breedData = breedsData[prediction.breedName as keyof typeof breedsData];
    
    if (!breedData) {
      throw new Error('Breed not found in database');
    }
    
    // Format result
    const result: IdentificationResult = {
      breedName: prediction.breedName,
      description: breedData.description,
      purpose: breedData.purpose,
      milkYield: breedData.milk_yield,
      region: breedData.region,
      physicalTraits: breedData.physical_traits,
      managementTips: breedData.management_tips,
      confidence: Math.round(prediction.confidence * 100)
    };
    
    return result;
  } catch (error) {
    console.error('Error identifying breed:', error);
    throw new Error('Failed to identify breed. Please try again.');
  }
};

// Function to get all breeds (for potential future use)
export const getAllBreeds = () => {
  return breedsData;
};