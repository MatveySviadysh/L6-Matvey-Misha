global.document = {
    removeEventListener: jest.fn(),
    addEventListener: jest.fn(),
    getElementById: jest.fn()
};

global.handleAddUserSubmit = jest.fn();
global.handleAddTodoSubmit = jest.fn();

const {
    setupFormEventListeners,
    handleFormClick
} = require('../script');

describe('SPA Script Tests', () => {
    test('setupFormEventListeners should call document methods', () => {
        setupFormEventListeners();
        
        expect(document.removeEventListener).toHaveBeenCalledWith('click', handleFormClick);
        expect(document.addEventListener).toHaveBeenCalledWith('click', handleFormClick);
    });

    test('handleFormClick should not add duplicate listeners', () => {
        const mockForm = {
            addEventListener: jest.fn(),
            setAttribute: jest.fn(),
            hasAttribute: jest.fn(() => true),
            closest: jest.fn()
        };

        const mockButton = {
            tagName: 'BUTTON',
            closest: jest.fn(() => mockForm)
        };

        const mockEvent = {
            target: mockButton
        };

        handleFormClick(mockEvent);

        expect(mockForm.addEventListener).not.toHaveBeenCalled();
        expect(mockForm.setAttribute).not.toHaveBeenCalled();
    });

    test('handleFormClick should handle event without target', () => {
        const mockEvent = {
            target: null
        };

        expect(() => {
            handleFormClick(mockEvent);
        }).not.toThrow();
    });

    test('handleFormClick should handle event without closest form', () => {
        const mockButton = {
            tagName: 'BUTTON',
            closest: jest.fn(() => null)
        };

        const mockEvent = {
            target: mockButton
        };

        expect(() => {
            handleFormClick(mockEvent);
        }).not.toThrow();
    });
});