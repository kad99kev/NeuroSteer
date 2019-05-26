class NeuralNetwork{
  constructor(model, inputs, hidden, outputs){
    if(model instanceof tf.Sequential){
      this.model = model;
      this.inputNodes = inputs;
      this.hiddenNodes = hidden;
      this.outputNodes = outputs;
    }
    else{
      this.inputNodes = inputs;
      this.hiddenNodes = hidden;
      this.outputNodes = outputs;
      this.model = this.createModel();
    }
  }

  copy(){
    return tf.tidy(() => {
    const modelCopy = this.createModel();
    const weights = this.model.getWeights();
    const weightCopies = [];
    for(let i = 0; i < weights.length; i++){
      weightCopies[i] = weights[i].clone();
    }
    modelCopy.setWeights(weightCopies);
    return new NeuralNetwork(modelCopy,
      this.inputNodes,
      this.hiddenNodes,
      this.outputNodes);
    });
  }

  mutate(rate){
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];
      for(let i = 0; i < weights.length; i++){
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();
        for(let j = 0; j < values.length; j++){
          if(random(1) < rate){
            let w = values[j];
            values[j] = w + randomGaussian();
          }
        }
        mutatedWeights[i] = tf.tensor(values, shape);
      }
      this.model.setWeights(mutatedWeights);
    });
  }

  dispose(){
    this.model.dispose();
  }

   predict(inputs){
    return tf.tidy(() => {
      const tfXs = tf.tensor2d([inputs]);
      const tfYs = this.model.predict(tfXs);
      const outputs = tfYs.dataSync();
      return outputs;
    });
  }

  createModel(){
    //Creation of model
     const model = tf.sequential();

    //Hidden Layer
    const hidden = tf.layers.dense({
      units: this.hiddenNodes, //Number of nodes
      inputShape: [this.inputNodes], //Input shape
      activation: 'sigmoid'
    });
    model.add(hidden); //Adding the layer

    //Output Layer
    const output = tf.layers.dense({
      units: this.outputNodes, //Number of nodes
      //inputShape inferred from previous layer
      activation: 'sigmoid'
    });
    model.add(output); //Adding the layer

    return model;
  }
}
