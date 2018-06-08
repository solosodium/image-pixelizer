(function() {

    /**
     * Internal Log utility class.
     */
    class Log {

        /** Default constructor. */
        constructor() {
            // Flag to enable verbose logging.
            this.isVerbose = true;
        }

        /**
         * Print info message.
         * @param {string} msg info message to print 
         */
        info(msg) {
            if (this.isVerbose) {
                console.log('[Info] ' + msg);
            }
        }

        /**
         * Print error message.
         * @param {string} msg error message to print  
         */
        error(msg) {
            console.error('[Error] ' + msg);
        }

    }

    module.exports = new Log();

})();