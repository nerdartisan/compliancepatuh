import React from 'react';
import { DEPARTMENTS } from '../constants';
import { Search, Info } from './Icons';

const FilterSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="border border-border-subtle rounded-lg p-4 bg-bg-card">
        <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-main">{title}</h3>
            <Info size={14} className="text-text-muted" />
        </div>
        {children}
    </div>
);

const FilterSidebar: React.FC = () => {
    return (
        <aside className="w-[320px] flex-shrink-0 bg-bg-main border-r border-border-subtle h-full overflow-y-auto p-4 space-y-4">
            <FilterSection title="Year">
                <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1 bg-primary text-white rounded-md font-semibold">AH</button>
                        <button className="px-3 py-1 bg-bg-main text-text-muted rounded-md border border-border-subtle">AD</button>
                    </div>
                </div>
                {/* Placeholder for range slider */}
                <div className="h-2 bg-gray-200 rounded-full my-2">
                   <div className="h-2 bg-primary w-3/4 rounded-full"></div>
                </div>
                <div className="flex justify-between text-sm">
                    <input type="text" readOnly value="1" className="w-1/3 bg-bg-main border border-border-subtle rounded-md p-1 text-center" />
                    <input type="text" readOnly value="1446" className="w-1/3 bg-bg-main border border-border-subtle rounded-md p-1 text-center" />
                </div>
            </FilterSection>

            <FilterSection title="Departments">
                <input
                    type="text"
                    placeholder="Search for a Department"
                    className="w-full bg-bg-card border border-gray-300 rounded-md py-1.5 px-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {DEPARTMENTS.slice(0, 8).map((dept, index) => (
                        <label key={dept} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/50" />
                                <span className="ml-2 text-text-main">{dept}</span>
                            </div>
                            <span className="text-text-muted text-xs">{Math.floor(Math.random() * 500)}</span>
                        </label>
                    ))}
                </div>
                 <button className="text-sm font-semibold text-primary hover:underline mt-2">Load More</button>
            </FilterSection>
            
            <FilterSection title="Author">
                 <input
                    type="text"
                    placeholder="Search for an Author"
                    className="w-full bg-bg-card border border-gray-300 rounded-md py-1.5 px-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                 <div className="space-y-2">
                     <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/50" />
                        <span className="ml-2 text-text-main text-sm">Internal Risk Committee</span>
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/50" />
                        <span className="ml-2 text-text-main text-sm">European Parliament</span>
                    </label>
                 </div>
            </FilterSection>
        </aside>
    );
};

export default FilterSidebar;