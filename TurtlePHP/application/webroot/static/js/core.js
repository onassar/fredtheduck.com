
// page init
var init = function() {

    /**
     * Image Navigation Events
     * 
     */

    // idle position setting; position variable
    $$('div.project div.images').each(function(images) {

        // storage
        images.get('tween').set('left', '0px');
        images.store('position', 0);
        images.store('max', images.getElements('div.image').length);

        // navigation width determining
        var parent = images.getParent(),
            width = 0;
        width += parent.getElement('.back').getStyle('width').toInt();
        width += parent.getElement('.back').getStyle('margin-left').toInt();
        width += parent.getElement('.back').getStyle('margin-right').toInt();
        width += (
                parent.getElement('span.active').getStyle('width').toInt()
                + parent.getElement('span.active').getStyle('margin-left').toInt()
                + parent.getElement('span.active').getStyle('margin-right').toInt()
            )
            * parent.getElements('div.nav span').length;
        width += parent.getElement('.next').getStyle('width').toInt();
        width += parent.getElement('.next').getStyle('margin-left').toInt();
        width += parent.getElement('.next').getStyle('margin-right').toInt();

        // set navigation width
        parent.getElement('div.nav').setStyle('width', width + 'px');
    });

    // event delegates
    $(document.body).addEvents({
        'click:relay(a.back)': function(event, target) {
            event.stop();

            // determine position and max number of images
            var project = $$('.project.' + target.get('rel')).shift(),
                images = project.getElement('div.images'),
                position = images.retrieve('position'),
                max = images.retrieve('max');

            // if the carousel can go any further back
            if (position !== 0) {

                // go back an equal distance
                var distance = (position - 1) * (-660);
                images.get('tween').start('left', distance + 'px');

                // update position in storage
                images.store('position', position - 1);

                // set active position
                project.getElement('.active').getPrevious().addClass('active');
                project.getElements('.active').pop().removeClass('active');
            }
        },
        'click:relay(a.next)': function(event, target) {
            event.stop();

            // determine position and max number of images
            var project = $$('.project.' + target.get('rel')).shift(),
                images = project.getElement('div.images'),
                position = images.retrieve('position'),
                max = images.retrieve('max');

            // if the carousel can go further ahead
            if (position !== (max - 1)) {

                // go forward an equal distance
                var distance = (position + 1) * (-660);
                images.get('tween').start('left', distance + 'px');

                // update position in storage
                images.store('position', position + 1);

                // set active position
                project.getElement('.active').getNext().addClass('active');
                project.getElement('.active').removeClass('active');
            }
        }
    });

    /**
     * Tag Events
     * 
     */

    // select project (stored via HTMLElement reference)
    var selected;

    // tag events
    $('tags').getElements('a').addEvents({
        'click': function(event) {
            event.stop();

            // mark the previously selected category
            var previous = selected;
            selected = null;
            if (previous) {
                previous.fireEvent('mouseout');
            }
            
            // remove active class (from previously active tag)
            $('tags').getElement('li a.active').removeClass('active');

            // add active state to clicked tag
            this.addClass('active');

            // run filter on the jigsaw based on the tag clicked
            var path = this.get('href'),
                category = path.split('/')[2];
            jigsaw.filter(category);
        }
    });

    /**
     * Project Section Toggling
     * 
     */

    // store default section showing
    $('modal').getElements('div.project').store('section', 'summary');
    $('modal').getElements('nav a').addEvent('click', function(event) {
        event.stop();
        var project = this.getParent().getParent(),
            previous = project.retrieve('section');
        project.removeClass(previous);
        project.addClass(this.get('rel'));
        project.store('section', this.get('rel'));
    });

    /**
     * Popup Events
     * 
     */

    // overlay click closing event
    $('overlay').addEvent('click', function(event) {
        event && event.stop();

        // hide overlay/modal (together create a popup)
        $(document.body).removeClass('modeling');
        $('overlay').setStyle('display', 'none');
        $('modal').setStyle('display', 'none');

        // remove project as having been selected
        selected = null;

        // fire mouseout event on a thumb, to restore the tags
        $('thumbs').getElement('li').fireEvent('mouseout');
    });

    // close button closing event
    $('close').addEvent('click', function(event) {
        $('overlay').fireEvent('click', event);
    });

    // tag click closing event
    $('tags').getElements('a').addEvent('click', function(event) {
        $('overlay').fireEvent('click', event);
    });

    /**
     * Thumb (aja. Project) Events
     * 
     */

    // jigsaw reference
    var jigsaw = (new Jigsaw(
        $('thumbs'),
        $('thumbs').getElements('li')
    ));

    // thumb events
    $('thumbs').getElements('li').addEvents({
        'mouseover': function(event) {
            var classes = this.className;
            $('tags').set('class', 'clear expose ' + classes);
        },
        'mouseout': function(event) {
            if (typeOf(selected) === 'null') {
                $('tags').set('class', 'clear');
            }
        }
    });

    // thumb anchor events
    var anchors = $('thumbs').getElements('a');
    anchors.addEvents({
        'click': function(event) {
            event.stop();
return;
            // show overlay/modal
            $(document.body).addClass('modeling');
            $('overlay').setStyle('display', 'block');
            $('modal').setStyle('display', 'block');

            // show proper project
            $('modal').className = this.getParent().getParent().get('rel');

            // set selected project
            selected = this.getParent().getParent();

return;

            // make all active inactive
            var active = $('details').getElement('li.active');
            if (active) {
                active.removeClass('active');
            }

            // grab position of anchor's parent from all items
            var parent = this.getParent().getParent(),
                project = parent.get('rel'),
                all = $('thumbs').getElements('li'),
                offset = all.indexOf(parent);

            // remove from all
            all.splice(offset, 1);
            jigsaw.hide(all);

            // show parent
            jigsaw.show([parent]);

            // set the selected project
            selected = parent;
            setTimeout(function() {
                var block = $('details').getElement('li.' + project);
                block.addClass('active');
            }, 500);
        },
        'mouseover': function(event) {
            
        }
    });
};
