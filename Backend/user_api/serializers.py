from rest_framework import serializers
from rest_framework.authtoken.models import Token
from user_api.models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = ('id', 'username', 'email', 'password','profile_pic')
        extra_kwargs = {'password': {'write_only': True, 'required': False}}
        depth = 1
        
    def create(self, validated_data):
        user = SiteUser(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        user.set_password(validated_data['password'])
        user.save()
        Token.objects.create(user=user)
        return user
