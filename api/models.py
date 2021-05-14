from django.db import models
import uuid

def generate_unique_code():
	code = None
	while(True):
		code = str(uuid.uuid4().hex)
		code = code.upper()
		code = "-".join((code[0:3], code[3:6]))
		if(Room.objects.filter(code = code).count() == 0):
			break
	return code
	
			
class Room(models.Model):
	code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
	host = models.CharField(max_length=50, unique=True)
	guest_can_pause = models.BooleanField(null=False, default=False)
	votes_to_skip = models.IntegerField(null=False, default=2)
	created_at = models.DateTimeField(auto_now_add=True)
	current_song = models.CharField(max_length=50, null=True)