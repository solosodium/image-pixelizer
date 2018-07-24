(function() {

  /**
   * Log class configuration.
   */
  let config = {
    isVerbose: true,    // info only writes if verbose is true
  };

  /**
   * Internal Log utility class.
   */
  class Log {

    /** Get configuration. */
    static config() {
      return config;
    }

    /**
     * Print info message.
     * @param {string} msg info message to print
     */
    static info(msg) {
      if (Log.config().isVerbose) {
        console.log('[Info] ' + msg);
      }
    }

    /**
     * Print error message.
     * @param {string} msg error message to print
     */
     static error(msg) {
       console.error('[Error] ' + msg);
     }
   }

   // Export singleton class.
   module.exports = Log;

})();
