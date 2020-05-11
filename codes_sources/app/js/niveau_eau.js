(function($){
    //je selectionne tout les inputs qui ont la class round et je les met dans une div qui a la class round //pour chaque input je créé la fonction
    $('input.round').wrap('<div class="round" />').each(function(){
        var $input = $(this);//sauvegarde de l'input
        var $div = $input.parent();//selection de la div qui a la class round
        var min = $input.data('min');//recuperation de la valeur min
        var max = $input.data('max');//recuperation de la valeur max
        var ratio = ($input.val() - min) / (max - min);
        var colorCircle = $input.data('color') ? $input.data('color') : "#91c2ff";//si la couleur n'est pas choisie une valeur par defaut s'applique
        var radius = $input.data('radius'); // largeur du cercle

        var $circle =$('<canvas width="200px" height="200px"/>');//creation du canvas
        var $color =$('<canvas width="200px" height="200px"/>');//creation du canvas
        $div.append($circle);//ajout du canvas
        $div.append($color);//ajout du canvas
        var ctx = $circle[0].getContext('2d'); //je recupere le contexte circle

        ctx.beginPath();
        ctx.arc(100,100,85,0,2*Math.PI)//X,Y,rayon,pointdedepart,point d'arriver qui se donne avec un angle
        ctx.lineWidth = 20; // épaisseur du cercle
        ctx.strokeStyle = "#fff";
        ctx.shadowOffsetX=2;//ombre
        ctx.shadowBlur = 5;
        ctx.shadowColor="rgba(0,0,0,0.1)";
        ctx.stroke();//trace la ligne


        var ctx = $color[0].getContext('2d'); //je recupere le contexte color
        ctx.beginPath(); //début du tracer
        ctx.arc(100,100,85,-1/2 * Math.PI, ratio*2*Math.PI - 1/2 * Math.PI);//X,Y,rayon,pointdedepart,point d'arriver qui se donne avec un angle
        ctx.lineWidth = 20; // épaisseur du cercle
        ctx.strokeStyle = colorCircle;
        ctx.stroke();//trace la ligne

        //recupétation de l'evenement click (fonction qui prend en paramatre l'evenement qui est le click)
        /*$div.click(function(even){
            event.preventDefault();
            var x = event.pageX - $div.offset().left - $div.width()/2; // permet de récuperer la position du click et de mettre 0 au centre de la div
            var y = event.pageY - $div.offset().top - $div.height()/2; // permet de récuperer la position du click et de mettre 0 au centre de la div
            var angle = Math.atan2(x,-y) / (2*Math.PI); // permet de convertir une valeur en angle (-y pour inverser le départ de l'angle) (la formule math permet d'avoir un ratio en tre 0 et 1)
            if(angle < 0){ angle+=1;} // permet de gerer les valeurs negatives
            ctx.clearRect(0,0,200,200); // permet de nettoyer un rectangle qui est notre canvas
            ctx.beginPath(); //début du tracer
            ctx.arc(100,100,85,-1/2 * Math.PI, angle*2*Math.PI - 1/2 * Math.PI);//X,Y,rayon,pointdedepart,point d'arriver qui se donne avec un angle
            ctx.lineWidth = 20; // épaisseur du cercle
            ctx.strokeStyle = color;
            ctx.stroke();//trace la ligne
            $input.val(Math.round(angle * (max -min)+ min));
        });*/

        //dectecte quand est ce que l'on  reste appuyer
        $div.mousedown(function(event){
            event.preventDefault(); //retire les evenements qui se passent par defaut
            $div.bind('mousemove', function(event){//lorsque que je fais pression sur la souris j'ecoute un second evenement qui est le mouvement de la souris
                var x = event.pageX - $div.offset().left - $div.width()/2; // permet de récuperer la position du click et de mettre 0 au centre de la div
                var y = event.pageY - $div.offset().top - $div.height()/2; // permet de récuperer la position du click et de mettre 0 au centre de la div
                var angle = Math.atan2(x,-y) / (2*Math.PI); // permet de convertir une valeur en angle (-y pour inverser le départ de l'angle) (la formule math permet d'avoir un ratio en tre 0 et 1)
                if(angle < 0){ angle+=1;} // permet de gerer les valeurs negatives
                ctx.clearRect(0,0,200,200); // permet de nettoyer un rectangle qui est notre canvas
                ctx.beginPath(); //début du tracer
                ctx.arc(100,100,85,-1/2 * Math.PI, angle*2*Math.PI - 1/2 * Math.PI);//X,Y,rayon,pointdedepart,point d'arriver qui se donne avec un angle
                ctx.lineWidth = 20; // épaisseur du cercle
                ctx.strokeStyle = colorCircle;
                ctx.stroke();//trace la ligne
                $input.val(Math.round(angle * (max -min)+ min));
            })
        }).mouseup(function(even){//lors que l'on lache un click
            event.preventDefault();
            $div.unbind('mousemove'); // annul l'evenement du deplacement de la souris
        })
    })

})(jQuery);