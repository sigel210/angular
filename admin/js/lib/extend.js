  /*
   * array 
   */
  // 根据index删除数组中的某个值
  Array.prototype.baoremove = function(index) {
    if (isNaN(index) || index > this.length) {
      return false;
    }
    this.splice(index, 1);
  };



  /*
   * obj
   */
