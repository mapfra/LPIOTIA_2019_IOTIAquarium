package fr.iotiaquarium.component;

public class TriggerComponent extends AquariumComponent{
	
	private Object status;

	public Object getStatus() {
		return status;
	}

	public void setStatus(Object status) {
		this.status = status;
	}
	
	public TriggerComponent(Object status)
	{
		this.setStatus(status);
	}
	

}
