/* function MyClass() { // constructor function
  const privateVariable = 'foo' // Private variable

  this.publicVariable = 'bar' // Public variable

  this.privilegedMethod = function () { // Public Method
    // alert(privateVariable)
  }
}

// Instance method will be available to all instances but only load once in memory
MyClass.prototype.publicMethod = function () {
  // alert(this.publicVariable)
}

// Static variable shared by all instances
MyClass.staticProperty = */
export const RessourcesAndRoutes = {
  fonts: "ressources/fonts",
  model_images: "ressources/model_ressources/images",
  // tslint:disable-next-line:object-literal-sort-keys
  images: "ressources/images",
};
