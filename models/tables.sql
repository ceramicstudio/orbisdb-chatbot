-- LIST accountRelation
table posts {
  stream_id text -- The stream id of the post - auto-generated (do not define when creating table)
  controller text -- The DID controller of the post - auto-generated (do not define when creating table)
  tag text -- The tag of the post
  body text -- The body of the post
  edited DateTime -- The date and time the post was edited
  created DateTime -- The date and time the post was created
}

-- SET accountRelation on subfield "actor"
table profiles { 
  stream_id text -- The stream id of the post - auto-generated (do not define when creating table)
  controller text -- The DID controller of the profile - auto-generated (do not define when creating table)
  name text -- The name of the profile
  actor text -- The actor of the profile - either robot or human
  emoji text -- The emoji of the profile
  username text -- The username of the profile
}