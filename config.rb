# setting path
http_path = "/"
css_dir = "public/styles/css"
sass_dir = "public/styles/_sass"
javascripts_dir = "public/js/"

# .sass-cache output
cache = false

# the asset cache buster
asset_cache_buster :none

# can be understood sass file by the browser
sass_options = { :debug_info => false }

# output_style
# output_style = :compact
output_style = :compressed

# relative_assets or absolute_assets
relative_assets = true

# whether line comments should be added to compiled css 
line_comments = false