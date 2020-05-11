<?php 
	include("commun/header.php");
?>
<div style="margin-top:10px;">
<a class="home" style="margin-left:10px; margin-top:10px;" href="Aquarium1.php"><button>Back</button></a>
	</div>
<div class=dinde>
    <h1>Lumière</h1>
    <div class="onoffswitch">
        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked>
        <label class="onoffswitch-label" for="myonoffswitch">
            <span class="onoffswitch-inner"></span>
            <span class="onoffswitch-switch"></span>
        </label>
    </div>
</div>
<div class=dinde>
    <h1>Pompe</h1>
    <div class="onoffswitch">
        <input type="checkbox" name="onoffswitch1" class="onoffswitch-checkbox" id="myonoffswitch1" checked>
        <label class="onoffswitch-label" for="myonoffswitch1">
            <span class="onoffswitch-inner"></span>
            <span class="onoffswitch-switch"></span>
        </label>
    </div>
</div>
<div class=dinde>
    <h1>Nourriture</h1>
    <div class="onoffswitch">
        <input type="checkbox" name="onoffswitch2" class="onoffswitch-checkbox" id="myonoffswitch2" checked>
        <label class="onoffswitch-label" for="myonoffswitch2">
            <span class="onoffswitch-inner"></span>
            <span class="onoffswitch-switch"></span>
        </label>
    </div>
</div>
<?php 
	include("commun/footer.php");
?>