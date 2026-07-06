export default {

    /**
     * Create Elementor elements from a JSON structure.
     *
     * @param {Array} tree - Array of Elementor element objects.
     */
    createTree(tree) {
        if(!window.elementor){
            return;
        }

        if(tree && typeof tree === 'object' && tree.length > 0){
            this.removedOldElements();
            tree.forEach((item, index) => {
                this.createElement(item, null, index);
            });
        }
    },

    /**
     * Remove old elements from the page.
     */
    removedOldElements() {
        const oldElements=window.elementor.elements.models;

        const ids=[];

        if(oldElements && typeof oldElements === 'object' && oldElements.length > 0){
            oldElements.forEach((element) => {
                ids.push(element.id);
            });
        }

        if(ids.length > 0){
            ids.forEach((id) => {
                const containerInstance=elementor.getContainer(id);
                if(containerInstance){
                    $e.run('document/elements/delete', {
                        container: containerInstance
                    });
                }
            });

        }
    },

    /**
     * Create a single element (container or widget).
     *
     * @param {Object} elementObj  - Node object from Elementor JSON.
     * @param {String|null} parentId - Parent container/widget ID.
     * @param {Number} position - Element index inside parent.
     * @returns {String} newElementId
     */
    createElement(elementObj, parentId = null, position = 0) {

        // Create a safe copy
        const model = { ...elementObj };
        const childElements = model.elements || [];
        delete model.elements;

        let container;
        const options = {
            at: position,
            edit: false
        };

        // ROOT ELEMENTS → Create inside preview container
        if (!parentId && model.elType === "container") {
            container = window.elementor.getPreviewContainer();
        } 
        else if (parentId) {
            // NESTED ELEMENTS → Use parent container
            container = parentId;
        } 
        else {
            // Root widgets fall here
            container = window.elementor.getPreviewContainer();
        }

        // CREATE ELEMENT (via Elementor engine)
        const newElement = $e.run("document/elements/create", {
            model,
            container,
            options
        });

        // RECURSIVE CHILD CREATION
        if (childElements.length > 0) {
            childElements.forEach((child, idx) => {
                this.createElement(child, newElement, idx);
            });
        }

        return newElement;
    }
};
