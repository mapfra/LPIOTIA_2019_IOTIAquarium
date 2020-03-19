package fr.iotiaquarium.component;

public abstract class SensorComponent extends AquariumComponent{
	
	private double value;

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
	}
	
	public SensorComponent(double value)
	{
		this.setValue(value);
	}

}
