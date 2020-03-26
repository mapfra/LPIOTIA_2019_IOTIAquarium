package fr.iotiaquarium.task;

import java.util.ArrayList;

import com.dieunelson.labyrinthai.core.brain.NeuronTask;

public class ComponentTask implements NeuronTask<Object>{
	
	// variable objet qui retourne un tableau de générécités quelqconque.
	private Class<?> myclass;
	
	public ComponentTask(Class<?> myclass)
	{
	this.setMyclass(myclass);
	}

	public Class<?> getMyclass() {
		return myclass;
	}

	public void setMyclass(Class<?> myclass) {
		this.myclass = myclass;
	}

	@Override
	public Object execute(ArrayList<Object> inputs) {
		// TODO Auto-generated method stub
		
		ArrayList<Object> output= new ArrayList<Object>();
		
		for (Object o: inputs)
		{
			if (o.getClass().equals(this.myclass))
			{
				output.add(o);
			}
		}
		
		return output;
	}

}
