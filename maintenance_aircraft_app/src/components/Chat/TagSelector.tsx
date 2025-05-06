import React from 'react';
import Badge from '../ui/Badge';
import { AircraftModel, IssueCategory } from '../../types';

interface TagSelectorProps {
  selectedAircraftModel: AircraftModel | null;
  selectedIssueCategory: IssueCategory | null;
  onSelectAircraftModel: (model: AircraftModel | null) => void;
  onSelectIssueCategory: (category: IssueCategory | null) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedAircraftModel,
  selectedIssueCategory,
  onSelectAircraftModel,
  onSelectIssueCategory,
}) => {
  const aircraftModels: AircraftModel[] = [
    'Boeing 737',
    'Airbus A320',
    'Boeing 787',
    'Airbus A350',
    'Embraer E190',
  ];

  const issueCategories: IssueCategory[] = [
    'Mechanical',
    'Electrical',
    'Hydraulics',
    'Avionics',
    'Environmental',
    'Structural',
  ];

  return (
    <div>
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aircraft Model</h4>
        <div className="flex flex-wrap gap-2">
          {aircraftModels.map((model) => (
            <Badge
              key={model}
              variant={selectedAircraftModel === model ? 'primary' : 'default'}
              onClick={() => onSelectAircraftModel(selectedAircraftModel === model ? null : model)}
              className="cursor-pointer"
            >
              {model}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issue Category</h4>
        <div className="flex flex-wrap gap-2">
          {issueCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedIssueCategory === category ? 'secondary' : 'default'}
              onClick={() => onSelectIssueCategory(selectedIssueCategory === category ? null : category)}
              className="cursor-pointer"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagSelector;