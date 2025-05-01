# Active Context

## Current Focus
- Implementing and refining draggable UI components
- Coordinate system optimization (pixels to percentage conversion)
- Event delegation for drag operations
- Text selection and cursor behavior improvements
- Message listener optimization
- State management in event handlers

## Recent Changes
- Created DraggleWrapper component with percentage-based positioning
- Implemented coordinate conversion utility functions
- Added support for axis-specific drag locking
- Improved text selection handling in draggable components
- Optimized cursor feedback for drag operations
- Enhanced event delegation with data-draggle-wrapper attribute
- Fixed message listener accumulation issues
- Implemented useRef for stable event handler references

## Next Steps
1. Test DraggleWrapper component in different contexts
2. Verify coordinate conversion accuracy
3. Optimize drag performance
4. Enhance accessibility for draggable elements
5. Document drag and drop patterns
6. Review event listener cleanup
7. Test state preservation across drag operations
8. Verify cursor behavior in all states

## Active Decisions
- Using percentage-based positioning for better responsiveness
- Implementing event delegation for drag handles
- Using data attributes for drag target identification
- Separating cursor styles from main component
- Using useRef for stable event handler references
- Implementing coordinate conversion utilities
- Maintaining text selection functionality
- Supporting axis-specific drag locking

## Considerations
- Browser compatibility for drag operations
- Performance impact of coordinate conversions
- Accessibility requirements for draggable elements
- Touch device support
- Event listener cleanup optimization
- State management patterns in event handlers
- Memory usage in drag operations
- User experience on different screen sizes