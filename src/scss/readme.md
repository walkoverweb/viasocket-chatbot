# SCSS file structure

//base

# global

    use global.scss file for global scss or scss less than 50 lines.

# var

    use base/_var.scss file for declaration of variables.

# text

    use base/ _text.scss file for font related styling.

# import

    use base/_import.scss file for importing other scss files than import the scss file in global.scss.

# utilities

    use folder for  utility scss files  like margin and padding.

# modules

    write component scss files in the comps folder.

# pages

    write pages scss files in the pages folder.

# always make scss files for pages & modules having more than 50 lines of scss.

# import scss files directly in \_import.scss file.

# use comments "//" in scss files to separate the scss from another scss for better understanding.
