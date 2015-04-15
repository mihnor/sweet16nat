i=1 
for f in ./*.gif; do echo "{
			\"id\": \"media$((i++))\", 
			\"type\": \"image\", 
			\"title\": \"Sweet16Nat$((i))\", 
			\"url\": \"/images/$f\"
		}," >> images-foo.json; done